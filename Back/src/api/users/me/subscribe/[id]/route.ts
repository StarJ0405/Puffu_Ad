import { container } from "tsyringe";
import { SubscribeService } from "services/subscribe";
import { CouponService } from "services/coupon";

export const POST: ApiHandler = async (req, res) => {
  const user_id = req.user?.id;
  if (!user_id) return res.status(401).json({ error: "unauthorized" });

  const { id } = req.params;
  const { reason, metadata } = req.body || {};

  const service = container.resolve(SubscribeService);

  // 소유 검증
  const [sub] = await service.getList({ where: { id, user_id }, take: 1 });
  if (!sub) return res.status(404).json({ error: "not_found" });

  // 이미 취소된 경우 idempotent
  if (sub.canceled_at) {
    return res.json({
      message: "already_canceled",
      canceled_at: sub.canceled_at,
      id: sub.id,
    });
  }

  try {
    // 1) 환불 견적
    const quote = await service.computeRefundQuote(id, user_id);

    // 2) 결제 환불
    if (quote.refund > 0) {
      await service.refund(id, user_id, quote.refund);
    }

    // 3) 구독 즉시 만료 + 쿠폰 회수
    await service.cancelSubscription(id, user_id);

    // 4) 취소 메타 업데이트
    await service.update(
      { id },
      {
        cancel_data: {
          ...(sub.cancel_data ?? {}),
          reason: reason ?? "user_requested",
          at: new Date().toISOString(),
          refund: quote.refund,
          benefit: quote.benefit,
          breakdown: quote.breakdown,
        },
        ...(metadata
          ? { metadata: { ...(sub.metadata ?? {}), cancel: metadata } }
          : {}),
      }
    );

    const [updated] = await service.getList({ where: { id }, take: 1 });
    return res.json({ content: { ...updated, refund_quote: quote } });
  } catch (e: any) {
    return res.status(400).json({ error: e?.message || "cancel_failed" });
  }
};