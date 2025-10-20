import { ReviewService } from "services/review";
import { container } from "tsyringe";

export const POST: ApiHandler = async (req, res) => {
  const { id } = req.params;
  const { best, index } = req.body;
  const service: ReviewService = container.resolve(ReviewService);

  const result = await service.update({ id }, { best, index });
  return res.json({ result });
};

export const GET: ApiHandler = async (req, res) => {
  const { id } = req.params;
  const { select, relations, withDeleted } = req.parsedQuery;
  const service: ReviewService = container.resolve(ReviewService);

  const content = await service.getById(id, { select, relations, withDeleted });
  return res.json({ content });
};
