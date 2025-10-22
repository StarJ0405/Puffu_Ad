import { container } from "tsyringe";
import { StoreService } from "services/store";

export const POST: ApiHandler = async (req, res) => {
  try {
    const { id, index } = req.params;
    const idx = Number(index);
    if (!Number.isInteger(idx)) return res.status(400).json({ error: "index must be integer" });
    const service = container.resolve(StoreService);
    const updated = await service.updateMiniBanner(id, idx, req.body);
    return res.json(updated);
  } catch (err: any) {
    if (err?.message === "Store not found") return res.status(404).json({ error: err.message });
    if (err?.message === "index out of range") return res.status(400).json({ error: err.message });
    return res.status(500).json({ error: err?.message ?? "internal error" });
  }
};

export const DELETE: ApiHandler = async (req, res) => {
  try {
    const { id, index } = req.params;
    const idx = Number(index);
    if (!Number.isInteger(idx)) return res.status(400).json({ error: "index must be integer" });
    const service = container.resolve(StoreService);
    await service.removeMiniBanner(id, idx);
    return res.status(204).end();
  } catch (err: any) {
    if (err?.message === "Store not found") return res.status(404).json({ error: err.message });
    if (err?.message === "index out of range") return res.status(400).json({ error: err.message });
    return res.status(500).json({ error: err?.message ?? "internal error" });
  }
};
