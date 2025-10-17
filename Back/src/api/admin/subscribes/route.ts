import { Subscribe } from "models/subscribe";
import { SubscribeService } from "services/subscribe";
import { container } from "tsyringe";
import { IsNull, Not } from "typeorm";

export const POST: ApiHandler = async (req, res) => {
  const {
    store_id,
    name,
    price,
    percent,
    value,
    metadata,
    _amount = 1,
    _return_data = false,
  } = req.body;

  const service: SubscribeService = container.resolve(SubscribeService);
  try {
    let result: Subscribe[] = [];
    const _data = {
      store_id,
      name,
      price,
      percent,
      value,
      metadata,
    };
    if (_amount === 1) {
      result = [await service.create(_data)];
    } else {
      result = await service.creates(_data, _amount);
    }
    return res.json(
      _return_data ? { content: result } : { message: "success" }
    );
  } catch (err: any) {
    return res.status(500).json({ error: err?.message, status: 500 });
  }
};

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
  if ("deleted_at" in where) {
    if (where.deleted_at) where.deleted_at = Not(IsNull());
    else where.deleted_at = IsNull();
  }

  const service: SubscribeService = container.resolve(SubscribeService);
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
    const content = await service.getList({ select, order, relations, where });
    return res.json({ content });
  }
};
