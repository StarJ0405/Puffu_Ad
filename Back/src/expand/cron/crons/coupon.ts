import { UserService } from "services/user";
import { container } from "tsyringe";
import { schedule } from "../module";
import { CouponService } from "services/coupon";

const delay = async (delay = 1000) =>
  await new Promise((resolve) => setTimeout(resolve, delay));
export function regist(DEV: boolean) {
  // 스케줄링된 작업 시작
  schedule(
    "0 0 0 1 * *",
    // "*/10 * * * * *",
    async () => {
      const userService = container.resolve(UserService);
      const service = container.resolve(CouponService);
      const userCount = await userService.getCount();
      const limit = 50;
      const total = Math.ceil(userCount / limit);

      for (let page = 0; page < total; page++) {
        const users = await userService.getPageable(
          { pageSize: limit, pageNumber: page },
          {
            select: ["id", "group_id"],
            relations: ["group.coupons"],
            order: { id: "DESC" },
          }
        );
        await Promise.all(
          (users?.content || [])
            .filter((u) => u.group && u.group.coupons?.length)
            .map(
              async (user) =>
                await service.giveCoupon(user.id, user?.group?.coupons || [])
            )
        );
        await delay(1000);
      }
    },
    {}
  );
}
