import { container } from "tsyringe";
import { SubscribeService } from "services/subscribe";

export const POST: ApiHandler = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: "unauthorized", status: 401 });

  const { id } = req.params;
  const { refund } = req.body || {};

  try {
    const service = container.resolve(SubscribeService);

    // 1) 견적 산출(요청에 refund 없으면 견적값 사용)
    const quote = await service.computeRefundQuote(id, userId, new Date());
    const amount = typeof refund === "number" ? refund : quote.refund;

    // 2) 결제 환불 처리
    await service.refund(id, userId, amount);

    // 3) 미사용 구독쿠폰 회수 + 즉시 만료
    await service.cancelSubscription(id, userId);

    return res.json({ content: { refunded: amount } });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || "refund_failed", status: 500 });
  }
};