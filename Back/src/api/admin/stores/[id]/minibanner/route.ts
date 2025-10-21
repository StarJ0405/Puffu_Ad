import { container } from "tsyringe";
import { StoreService } from "services/store";

export const GET: ApiHandler = async (req, res) => {
  const { id } = req.params;
  const service = container.resolve(StoreService);
  const items = await service.getMiniBanners(id);
  return res.json({ items });
};

export const POST: ApiHandler = async (req, res) => {
  const { id } = req.params;
  const service = container.resolve(StoreService);
  const { action, data } = req.body ?? {};

  if (action === "add") {
    const created = await service.addMiniBanner(id, data); // {name,link,thumbnail:{pc,mobile}}
    return res.json(created);
  }
  if (action === "reorder") {
    const { fromIndex, toIndex } = data ?? {};
    const items = await service.reorderMiniBanner(id, Number(fromIndex), Number(toIndex));
    return res.json({ items });
  }
  if (action === "replace") {
    const items = await service.replaceMiniBanners(id, data ?? []);
    return res.json({ items });
  }
  return res.status(400).json({ error: "invalid action" });
};
