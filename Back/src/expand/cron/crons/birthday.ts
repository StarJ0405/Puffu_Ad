import { Target } from "models/coupon";
import { CouponService } from "services/coupon";
import { UserService } from "services/user";
import { container } from "tsyringe";
import { schedule } from "../module";
import { IsNull } from "typeorm";

const delay = async (delay = 1000) =>
  await new Promise((resolve) => setTimeout(resolve, delay));
export function regist(DEV: boolean) {
  // 스케줄링된 작업 시작
  const task = schedule(
    "0 0 0 * * *",
    // "*/10 * * * * *",
    async () => {
      const userService = container.resolve(UserService);
      const service = container.resolve(CouponService);
      const birthdays = await service.getList({
        where: {
          target: Target.BIRTHDAY,
          user_id: IsNull(),
        },
      });
      if (birthdays.length === 0) return task.destroy();
      const userCount = await userService.getCount({
        where: { birthday: new Date() },
      });
      const limit = 50;
      const total = Math.ceil(userCount / limit);

      for (let page = 0; page < total; page++) {
        const users = await userService.getPageable(
          { pageSize: limit, pageNumber: page },
          {
            where: { birthday: new Date() },
            select: ["id"],
            order: { id: "DESC" },
          }
        );
        await Promise.all(
          (users?.content || []).map(
            async (user) => await service.giveCoupon(user.id, birthdays)
          )
        );
        await delay(1000);
      }
    },
    {}
  );
}
