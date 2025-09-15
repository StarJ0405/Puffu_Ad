import { PointService } from "services/point";
import { container } from "tsyringe";
import { ILike } from "typeorm";

export const GET: ApiHandler = async (req, res) => {
  const user = req.user;
  let {
    pageSize,
    pageNumber = 0,
    relations,
    order,
    select,
    ...where
  } = req.parsedQuery;
  const service: PointService = container.resolve(PointService);
  where = { ...where, user_id: user.id };
  if (pageSize) {
    const page = await service.getPointPageable(
      {
        pageSize: Number(pageSize),
        pageNumber: Number(pageNumber),
      },
      { select, order, relations, where }
    );
    return res.json(page);
  } else {
    const content = await service.getPointList({
      select,
      order,
      relations,
      where,
    });
    return res.json({ content });
  }
};
