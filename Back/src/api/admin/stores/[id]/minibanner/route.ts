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


export const POST: ApiHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const service = container.resolve(StoreService);
    const { action, data } = req.body ?? {};

    if (!action) return res.status(400).json({ error: "action required" });

    if (action === "add") {
      if (!data || !data?.name || !data?.link || !data?.thumbnail?.pc || !data?.thumbnail?.mobile) {
        return res.status(400).json({ error: "invalid payload" });
      }
      const created = await service.addMiniBanner(id, data);
      return res.json(created);
    }

    if (action === "reorder") {
      const { fromIndex, toIndex } = data ?? {};
      if (!Number.isInteger(fromIndex) || !Number.isInteger(toIndex)) {
        return res.status(400).json({ error: "fromIndex/toIndex must be integers" });
      }
      const items = await service.reorderMiniBanner(id, Number(fromIndex), Number(toIndex));
      return res.json({ items });
    }

    if (action === "replace") {
      if (!Array.isArray(data)) return res.status(400).json({ error: "items array required" });
      const items = await service.replaceMiniBanners(id, data);
      return res.json({ items });
    }

    return res.status(400).json({ error: "invalid action" });
  } catch (err: any) {
    if (err?.message === "Store not found") return res.status(404).json({ error: err.message });
    if (err?.message === "index out of range") return res.status(400).json({ error: err.message });
    if (/required/.test(err?.message || "")) return res.status(400).json({ error: err.message });
    return res.status(500).json({ error: err?.message ?? "internal error" });
  }
};