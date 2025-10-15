import { CouponService } from "services/coupon";
import { ReviewService } from "services/review";
import { container } from "tsyringe";

export const POST: ApiHandler = async (req, res) => {
  const user = req.user;
  const {
    item_id,
    content,
    images,
    metadata,
    star_rate,
    return_data = false,
  } = req.body;

  const service: ReviewService = container.resolve(ReviewService);
  try {
    const _data = {
      user_id: user.id,
      item_id,
      content,
      images,
      star_rate,
      metadata,
    };

    const result = await service.create(_data);
    const couponService = container.resolve(CouponService);
    couponService.checkReview(user.id);
    return res.json(return_data ? { content: result } : { message: "success" });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message, status: 500 });
  }
};

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
  const service: ReviewService = container.resolve(ReviewService);
  where = { ...where, user_id: user.id };
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
