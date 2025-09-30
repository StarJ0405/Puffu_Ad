import { RecommendService } from "services/recommend";
import { container } from "tsyringe";

export const GET: ApiHandler = async (req, res) => {
  const user = req.user;
  const { id: review_id } = req.params;
  const { select, relations } = req.parsedQuery;

  const service: RecommendService = container.resolve(RecommendService);

  const list = await service.getList({
    where: { user_id: user.id, review_id },
    select,
    relations,
    order: undefined,
  });

  const content = list?.[0] ?? null;
  return res.json({ content });
};

export const DELETE: ApiHandler = async (req, res) => {
  const user = req.user;
  const { id: review_id } = req.params;

  const service: RecommendService = container.resolve(RecommendService);
  try {
    await service.delete({ user_id: user.id, review_id }, /* soft */ false);
    return res.json({ message: "success" });
  } catch (err: any) {
    return res.json({ message: "success" });
  }
};
