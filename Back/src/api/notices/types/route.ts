import { NoticeService } from "services/notice";
import { container } from "tsyringe";

export const GET: ApiHandler = async (req, res) => {
  let { store_id } = req.parsedQuery;
  if (!store_id)
    return res.status(404).json({ error: "필요한 정보가 부족합니다." });
  const service: NoticeService = container.resolve(NoticeService);

  const content = await service.getTypes(store_id);
  return res.json({ content });
};
