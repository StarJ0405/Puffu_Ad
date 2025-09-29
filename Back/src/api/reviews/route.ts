import { ReviewService } from "services/review";
import { container } from "tsyringe";
import { Raw } from "typeorm";

export const GET: ApiHandler = async (req, res) => {
  let {
    pageSize,
    pageNumber = 0,
    relations,
    order,
    select,
    ...where
  } = req.parsedQuery;
  if ("photo" in where) {
    if (where.photo) {
      where.images = Raw((images) => `array_length(${images}, 1) >= 1`);
    } else {
      where.images = Raw((images) => `array_length(${images}, 1) = 0`);
    }
    delete where.photo;
  }
  const service: ReviewService = container.resolve(ReviewService);
  if (pageSize) {
    const page = await service.getPageable(
      {
        pageSize: Number(pageSize),
        pageNumber: Number(pageNumber),
      },
      { select, order, relations, where }
    );
    return res.json(page);
  } else {
    const content = await service.getList({ select, order, relations, where });
    return res.json({ content });
  }
};
