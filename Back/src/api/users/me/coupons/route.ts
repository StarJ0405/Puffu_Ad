import { CouponService } from "services/coupon";
import { container } from "tsyringe";
import { LessThanOrEqual } from "typeorm";

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
  const service: CouponService = container.resolve(CouponService);
  where = {
    ...where,
    user_id: user.id,
    appears_at: LessThanOrEqual(new Date()),
  };
  if (pageSize) {
    const page = await service.getWithOrder(
      { select, order, relations, where },
      {
        pageSize: Number(pageSize),
        pageNumber: Number(pageNumber),
      }
    );
    return res.json(page);
  } else {
    const content = await service.getWithOrder({
      select,
      order,
      relations,
      where,
    });
    return res.json({ content });
  }
};
