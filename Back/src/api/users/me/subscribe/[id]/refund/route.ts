import { container } from "tsyringe";
import { SubscribeService } from "services/subscribe";

export const POST: ApiHandler = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: "unauthorized", status: 401 });

  const { id } = req.params;
  try {
    const service = container.resolve(SubscribeService);

    // 소유권·존재 가드
    const [sub] = await service.getList({ where: { id, user_id: userId }, take: 1 });
    if (!sub) return res.status(404).json({ error: "SUBSCRIPTION_NOT_FOUND", status: 404 });
    if (sub.canceled_at) return res.json({ content: { refunds: [], total_refund: 0, note: "already_canceled" } });

    // 활성일 경우 + 다음 예약까지 일괄 환불/해지
    const result = await service.cancelAndRefundCascade(id, userId, new Date());

    return res.json({ content: result });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || "refund_failed", status: 500 });
  }
};