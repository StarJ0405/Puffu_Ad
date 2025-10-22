import { container } from "tsyringe";
import { StoreService } from "services/store";

export const GET: ApiHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const service = container.resolve(StoreService);
    const items = await service.getMiniBanners(id);
    return res.json({ items });
  } catch (err: any) {
    if (err?.message === "Store not found") return res.status(404).json({ error: err.message });
    return res.status(500).json({ error: err?.message ?? "internal error" });
  }
};