import { OfflineStoreService } from "services/offline_store";
import { container } from "tsyringe";

export const GET: ApiHandler = async (req, res) => {
  const { id } = req.params;
  const { select, relations, withDeleted } = req.parsedQuery;
  const service: OfflineStoreService = container.resolve(OfflineStoreService);

  const content = await service.getById(id, { select, relations, withDeleted });
  return res.json({ content });
};
