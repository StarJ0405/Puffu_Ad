import { Coupon } from "models/coupon";
import { CouponService } from "services/coupon";
import { container } from "tsyringe";
import { IsNull, Not } from "typeorm";

export const POST: ApiHandler = async (req, res) => {
  const {
    store_id,
    name,
    condition,
    type,
    value,
    calc,
    min,
    appears_at,
    date,
    starts_at,
    ends_at,
    range,
    date_unit,
    target,
    group_id,
    issue_date,
    issue_lunar,
    review_min,
    review_photo,
    max_quantity,
    quantity,
    duplicate,
    total_min,
    total_max,
    order_starts_at,
    order_ends_at,
    buy_type,
    buy_min,
    code,
    interval,
    user_id,
    origin_id,
    item_id,
    order_id,
    shipping_method_id,
    metadata,
    products,
    categories,
    _amount = 1,
    _return_data = false,
  } = req.body;

  const service: CouponService = container.resolve(CouponService);
  try {
    let result: Coupon[] = [];
    const _data = {
      store_id,
      name,
      condition,
      type,
      value,
      calc,
      min,
      appears_at,
      date,
      starts_at,
      ends_at,
      range,
      date_unit,
      target,
      group_id,
      issue_date,
      issue_lunar,
      review_min,
      review_photo,
      max_quantity,
      quantity,
      duplicate,
      total_min,
      total_max,
      order_starts_at,
      order_ends_at,
      buy_type,
      buy_min,
      code,
      interval,
      user_id,
      origin_id,
      item_id,
      order_id,
      shipping_method_id,
      metadata,
      products,
      categories,
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
  const service: CouponService = container.resolve(CouponService);
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
