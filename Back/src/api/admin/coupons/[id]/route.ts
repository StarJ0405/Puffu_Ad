import { Coupon, Target } from "models/coupon";
import { CouponService } from "services/coupon";
import { UserService } from "services/user";
import { container } from "tsyringe";
import { In } from "typeorm";

export const POST: ApiHandler = async (req, res) => {
  const { id } = req.params;
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
    return_data = false,
  } = req.body;

  const service: CouponService = container.resolve(CouponService);
  try {
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
export const PUT: ApiHandler = async (req, res) => {
  const { id } = req.params;
  const { group_id, users, amount = 1 } = req.body;
  const service = container.resolve(CouponService);
  const coupon = await service.getById(id, {
    relations: ["categories", "products"],
  });
  if (!coupon)
    return res.status(404).json({ error: "해당하는 쿠폰이 없습니다." });
  if (coupon.target !== Target.MANUAL)
    return res.status(404).json({ error: "적절하지 않은 유형의 쿠폰입니다." });
  const userService = container.resolve(UserService);
  if (group_id) {
    const count = await userService.getCount({
      where: { group_id },
    });
    const limit = 1000;
    if (count > limit) {
      const page = Math.ceil(count / limit);
      await Promise.all(
        Array.from({ length: page }).map(async (_, page) => {
          const _users = await userService.getList({
            where: { group_id },
            select: ["id", "group_id"],
            take: limit,
            skip: limit * page,
          });
          await Promise.all(
            _users.map(
              async (user) =>
                await service.giveCoupon(user.id, coupon, {
                  amount,
                  update: false,
                })
            )
          );
        })
      );
      await service.updateQuantity(coupon.id);
    } else {
      const _users = await userService.getList({
        where: { group_id },
        select: ["id", "group_id"],
      });
      await Promise.all(
        _users.map(
          async (user) =>
            await service.giveCoupon(user.id, coupon, { amount, update: false })
        )
      );
      await service.updateQuantity(coupon.id);
    }
  } else if (users) {
    const _users = await userService.getList({
      where: {
        username: In(users),
      },
      select: ["id"],
    });
    await Promise.all(
      _users.map(
        async (user) =>
          await service.giveCoupon(user.id, coupon, { amount, update: false })
      )
    );
    await service.updateQuantity(coupon.id);
  } else {
    const count = await userService.getCount();
    const limit = 1000;
    if (count > limit) {
      const page = Math.ceil(count / limit);
      await Promise.all(
        Array.from({ length: page }).map(async (_, page) => {
          const _users = await userService.getList({
            select: ["id"],
            take: limit,
            skip: limit * page,
          });
          await Promise.all(
            _users.map(
              async (user) =>
                await service.giveCoupon(user.id, coupon, {
                  amount,
                  update: false,
                })
            )
          );
        })
      );
      await service.updateQuantity(coupon.id);
    } else {
      const _users = await userService.getList({
        select: ["id"],
      });
      await Promise.all(
        _users.map(
          async (user) =>
            await service.giveCoupon(user.id, coupon, {
              amount,
              update: false,
            })
        )
      );
      await service.updateQuantity(coupon.id);
    }
  }
  return res.json({ message: "success" });
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
