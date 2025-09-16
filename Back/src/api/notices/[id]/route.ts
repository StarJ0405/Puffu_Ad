import { NoticeService } from "services/notice";
import { container } from "tsyringe";

export const GET: ApiHandler = async (req, res) => {
  const { id } = req.params;
  const { select, relations, withDeleted } = req.parsedQuery;
  const service: NoticeService = container.resolve(NoticeService);

  const content = await service.getById(id, { select, relations, withDeleted });
  return res.json({ content });
};
