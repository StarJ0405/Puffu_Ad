import { container } from "tsyringe";
import { StoreService } from "services/store";

export const POST: ApiHandler = async (req, res) => {
  const { id, index } = req.params;
  const service = container.resolve(StoreService);
  const updated = await service.updateMiniBanner(id, Number(index), req.body); // Partial
  return res.json(updated);
};

export const DELETE: ApiHandler = async (req, res) => {
  const { id, index } = req.params;
  const service = container.resolve(StoreService);
  await service.removeMiniBanner(id, Number(index));
  return res.status(204).end();
};
