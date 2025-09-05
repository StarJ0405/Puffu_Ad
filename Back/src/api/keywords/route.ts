import { KeywordsService } from "services/keywords";
import { container } from "tsyringe";

export const GET: ApiHandler = async (req, res) => {
  const { store_id, start_date, end_date } = req.parsedQuery;
  const service: KeywordsService = container.resolve(KeywordsService);
  const keywords = await service.getPopulars(
    { pageSize: 10, pageNumber: 0 },
    {
      store_id: store_id,
      start_date,
      end_date,
    }
  );
  return res.json({ content: keywords });
};
