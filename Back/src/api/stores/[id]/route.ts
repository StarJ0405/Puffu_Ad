import { StoreService } from "services/store";
import { container } from "tsyringe";

export const GET: ApiHandler = async (req, res) => {
  const { id } = req.params;
  const { select, relations, withDeleted } = req.parsedQuery;
  const service: StoreService = container.resolve(StoreService);

  const content = await service.getById(id, { select, relations, withDeleted });
  return res.json({ content });
};
