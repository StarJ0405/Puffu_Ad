import { container } from "tsyringe";
import { OrderService } from "services/order";

export const GET: ApiHandler = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: "unauthorized", status: 401 });

  const { id } = req.params;

  try {
    const service = container.resolve(OrderService);
    const content = await service.calcSubscriptionBenefit(id, userId);
    return res.json({ content });
  } catch (e: any) {
    const msg = e?.message || "calc_failed";
    const code = msg === "FORBIDDEN" ? 403 : msg === "ORDER_NOT_FOUND" ? 404 : 500;
    return res.status(code).json({ error: msg, status: code });
  }
};
