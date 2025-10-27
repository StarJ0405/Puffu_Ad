import { container } from "tsyringe";
import { OrderService } from "services/order";

export const GET: ApiHandler = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: "unauthorized", status: 401 });

  const { id } = req.params; // subscriptionId
  const { from, to } = req.parsedQuery;

  try {
    const now = new Date();
    const fromDate = from ? new Date(String(from)) : new Date(now.getFullYear(), now.getMonth(), 1);
    const toDate = to ? new Date(String(to)) : now;

    const service = container.resolve(OrderService);
    const content = await service.getBenefitSummaryOnDemand(id, userId, fromDate, toDate);
    return res.json({ content });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || "calc_failed", status: 500 });
  }
};
