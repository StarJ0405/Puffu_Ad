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
    const _data = { store_id, name, price, percent, value, metadata };
    let result = [];
    if (_amount === 1) {
      const created = await service.create(_data);
      result = [created];
    } else {
      result = await service.creates(_data, _amount);
    }
    return res.json(_return_data ? { content: result } : { message: "success" });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message, status: 500 });
  }
};

export const GET: ApiHandler = async (req, res) => {
  const {
    store_id,
    name,
    pageSize,
    pageNumber = 0,
    relations,
    order,
    select,
    withDeleted,
    ...where
  } = req.parsedQuery;

  const service: SubscribeService = container.resolve(SubscribeService);

  // deleted_at 필터 처리
  if ("deleted_at" in where) {
    if (where.deleted_at) where.deleted_at = Not(IsNull());
    else where.deleted_at = IsNull();
  }

  try {
    if (store_id && !pageSize) {
      const plan = await service.getDefaultPlan(String(store_id), name);
      return res.json({ content: plan ? [plan] : [] });
    }
    if (pageSize) {
      const page = await service.getPageable(
        {
          pageSize: Number(pageSize),
          pageNumber: Number(pageNumber),
        },
        { select, order, relations, where, withDeleted }
      );
      return res.json(page);
    }

    // 리스트 전체 조회
    const content = await service.getList({
      select,
      order,
      relations,
      where,
      withDeleted,
    });
    return res.json({ content });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message, status: 500 });
  }
};