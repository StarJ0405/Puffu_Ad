import { LogRepository } from "repositories/log";
import { PointService } from "services/point";
import { container } from "tsyringe";

export const GET: ApiHandler = async (req, res) => {
  const { id } = req.params;
  let {
    pageSize,
    pageNumber = 0,
    relations,
    order,
    select,
    ...where
  } = req.parsedQuery;
  const service: PointService = container.resolve(PointService);

  where = { ...where, user_id: id };
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

export const POST: ApiHandler = async (req, res) => {
  const { id } = req.params;
  const { point, memo } = req.body;
  const service = container.resolve(PointService);
  const repo = container.resolve(LogRepository);
  if (point > 0) {
    await service.create({
      user_id: id,
      point,
    });
    await repo.create({
      type: "point",
      name: "관리자 지급",
      data: {
        point,
        user_id: id,
        total: await service.getTotalPoint(id),
      },
      metadata: { memo },
    });
  } else if (point < 0) {
    await service.usePoint(id, -point, {}, false);
    await repo.create({
      type: "point",
      name: "관리자 회수",
      data: {
        point: point,
        user_id: id,
        total: await service.getTotalPoint(id),
      },
      metadata: { memo },
    });
  }
  return res.json({ message: "success" });
};
