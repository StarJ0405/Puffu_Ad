import _ from "lodash";
import { RefundService } from "services/refund";
import { container } from "tsyringe";
import { IsNull, Not } from "typeorm";

export const GET: ApiHandler = async (req, res) => {
  let {
    pageSize,
    pageNumber = 0,
    relations,
    order,
    select,
    withDeleted,
    ...where
  } = req.parsedQuery;
  if (where.store_id) {
    if (where.order)
      where.order = _.merge(where.order, { store_id: where.store_id });
    else where.order = { store_id: where.store_id };
    delete where.store_id;
  }
  if (where.completed_at) {
    where.completed_at = Not(IsNull());
  }
  if (where.deleted_at) {
    where.deleted_at = Not(IsNull());
  }
  const service: RefundService = container.resolve(RefundService);
  if (pageSize) {
    const page = await service.getPageable(
      {
        pageSize: Number(pageSize),
        pageNumber: Number(pageNumber),
      },
      { select, order, relations, where, withDeleted }
    );
    return res.json(page);
  } else {
    const content = await service.getList({
      select,
      order,
      relations,
      where,
      withDeleted,
    });
    return res.json({ content });
  }
};
