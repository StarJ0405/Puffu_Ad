import { Coupon } from "models/coupon";
import { CouponService } from "services/coupon";
import { container } from "tsyringe";

export const POST: ApiHandler = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    type,
    store_id,
    user_id,
    item_id,
    order_id,
    shipping_method_id,
    group_id,
    target,
    value,
    calc,
    date,
    date_unit,
    range,
    starts_at,
    ends_at,
    metadata,
    return_data = false,
  } = req.body;

  const service: CouponService = container.resolve(CouponService);
  try {
    const _data = {
      name,
      type,
      store_id,
      user_id,
      item_id,
      order_id,
      shipping_method_id,
      group_id,
      target,
      value,
      calc,
      date,
      date_unit,
      range,
      starts_at,
      ends_at,
      metadata,
    };
    const result: UpdateResult<Coupon> = await service.update(
      { id: id },
      _data,
      true
    );
    return res.json(return_data ? { content: result } : { message: "success" });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message, status: 500 });
  }
};

export const GET: ApiHandler = async (req, res) => {
  const { id } = req.params;
  const { select, relations, withDeleted } = req.parsedQuery;
  const service: CouponService = container.resolve(CouponService);

  const content = await service.getById(id, { select, relations, withDeleted });
  return res.json({ content });
};

export const DELETE: ApiHandler = async (req, res) => {
  const { id } = req.params;
  const { soft } = req.parsedQuery;
  const service: CouponService = container.resolve(CouponService);
  const result = await service.delete(
    {
      id,
    },
    soft
  );
  if (result) {
    return res.json({ message: "sucess" });
  } else {
    return res.status(404).json({ error: "fail" });
  }
};
