import { container } from "tsyringe";
import { SubscribeService } from "services/subscribe";

export const GET: ApiHandler = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: "unauthorized", status: 401 });

  const { id } = req.params;
  if (!id) return res.status(400).json({ error: "missing_id", status: 400 });

  try {
    const service = container.resolve(SubscribeService);
    const content = await service.computeRefundQuote(id, userId);
    return res.json({ content });
  } catch (e: any) {
    const msg = String(e?.message || "");
    if (msg === "SUBSCRIPTION_NOT_FOUND") {
      return res.status(404).json({ error: msg, status: 404 });
    }
    return res.status(500).json({ error: "quote_failed", status: 500 });
  }
};
