import { Coupon } from "models/coupon";
import { CouponService } from "services/coupon";
import { container } from "tsyringe";

export const POST: ApiHandler = async (req, res) => {
  const {
    name,
    type,
    store_id,
    user_id,
    item_id,
    order_id,
    shipping_method_id,
    value,
    calc,
    date,
    date_unit,
    range,
    starts_at,
    ends_at,
    metadata,
    _amount = 1,
    _return_data = false,
  } = req.body;

  const service: CouponService = container.resolve(CouponService);
  try {
    let result: Coupon[] = [];
    const _data = {
      name,
      type,
      store_id,
      user_id,
      item_id,
      order_id,
      shipping_method_id,
      value,
      calc,
      date,
      date_unit,
      range,
      starts_at,
      ends_at,
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
    ...where
  } = req.parsedQuery;

  const service: CouponService = container.resolve(CouponService);
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
