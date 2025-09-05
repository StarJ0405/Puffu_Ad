import { KeywordsService } from "services/keywords";
import { container } from "tsyringe";

export const POST: ApiHandler = async (req, res) => {
  const user = req.user;
  const { store_id, keyword } = req.body;
  if (!store_id || !keyword)
    return res.status(404).json({ error: "데이터가 부족합니다.", status: 404 });

  try {
    const service = container.resolve(KeywordsService);
    const _keyword = await service.create({
      user_id: user.id,
      store_id,
      keyword,
    });

    return res.json(
      _keyword ? { message: "success" } : { error: "create error" }
    );
  } catch (err: any) {
    return res.status(404).json({ error: err.message, status: 404 });
  }
};
