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
    type,
    ...where
  } = req.parsedQuery;
  const service: CouponService = container.resolve(CouponService);
  where = {
    ...where,
    user_id: user.id,
    appears_at: LessThanOrEqual(new Date()),
  };
  const valid = new Set(["order", "item", "shipping"]);
  if (typeof type === "string" && valid.has(type)) {
    where.type = type;
  }
  if ("status" in req.parsedQuery) {
    const status = String(req.parsedQuery.status);
    if (status === "expired") {
      where.used = true;  // 기간만료 or 사용만료 전체
    } else if (status === "expired_date") {
      where._expired = true; // 기간만료만
    } else if (status === "expired_used") {
      where.used = true; // 사용된 것만
    }
  }
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
