import lunisolar from "lunisolar";
import { Condition, Target } from "models/coupon";
import { User } from "models/user";
import { CouponService } from "services/coupon";
import { UserService } from "services/user";
import { container } from "tsyringe";
import { IsNull, MoreThan, Or, Raw } from "typeorm";
import { schedule } from "../module";

const delay = async (delay = 1000) =>
  await new Promise((resolve) => setTimeout(resolve, delay));
export function regist(DEV: boolean) {
  // 스케줄링된 작업 시작
  schedule(
    "0 0 0 */1 * *",
    // "*/10 * * * * *",
    async () => {
      const limit = 500;
      const now = new Date();
      const userService = container.resolve(UserService);
      const service = container.resolve(CouponService);
      // 생일
      const birthday = await service.getList({
        where: {
          target: Target.CONDTION,
          condition: Condition.BIRTHDAY,
          user_id: IsNull(),
          ends_at: Or(IsNull(), MoreThan(now)),
        },
      });
      if (birthday.length > 0) {
        await Promise.all(
          birthday.map(async (birth) => {
            let count = 0;
            if (birth.group_id) {
              count = await userService.getCount({
                where: {
                  group_id: birth.group_id,
                  birthday: now.toISOString(),
                },
              });
            } else {
              count = await userService.getCount({
                where: {
                  birthday: now.toISOString(),
                },
              });
            }
            if (count === 0) return;
            const max = Math.ceil(count / limit);
            await Promise.all(
              Array.from({ length: max }).map(async (_, page) => {
                let users: User[] = [];

                if (birth.group_id) {
                  users = await userService.getList({
                    where: {
                      group_id: birth.group_id,
                      birthday: now.toISOString(),
                    },
                    take: limit,
                    skip: limit * page,
                    select: ["id", "group_id", "birthday"],
                  });
                } else {
                  users = await userService.getList({
                    take: limit,
                    skip: limit * page,
                    select: ["id", "birthday"],
                    where: {
                      birthday: now.toISOString(),
                    },
                  });
                }
                return await Promise.all(
                  users.map(
                    async (user) =>
                      await service.giveCoupon(user.id, birth, {
                        update: false,
                      })
                  )
                );
              })
            );
            return await service.updateQuantity(birth.id);
          })
        );
      }
      // 기념일
      const solars = await service.getList({
        where: {
          target: Target.CONDTION,
          condition: Condition.DATE,
          user_id: IsNull(),
          ends_at: Or(IsNull(), MoreThan(now)),
          issue_date: Raw(
            (date) =>
              `DATE_PART('month', ${date}) = DATE_PART('month', CURRENT_DATE) AND DATE_PART('day', ${date}) = DATE_PART('day', CURRENT_DATE)`
          ),
          issue_lunar: false,
        },
      });
      const _lunar = lunisolar(now).lunar;
      const lunars = await service.getList({
        where: {
          target: Target.CONDTION,
          condition: Condition.DATE,
          user_id: IsNull(),
          ends_at: Or(IsNull(), MoreThan(now)),
          issue_date: Raw(
            (date) =>
              `DATE_PART('month', ${date}) = ${_lunar.month} AND DATE_PART('day', ${date}) = ${_lunar.day}`
          ),
          issue_lunar: true,
        },
      });
      const dates = [...(lunars || []), ...(solars || [])];
      await Promise.all(
        dates.map(async (coupon) => {
          let count = 0;
          if (coupon.group_id) {
            count = await userService.getCount({
              where: {
                group_id: coupon.group_id,
              },
            });
          } else {
            count = await userService.getCount();
          }
          if (count === 0) return;

          const max = Math.ceil(count / limit);
          await Promise.all(
            Array.from({ length: max }).map(async (_, page) => {
              let users: User[] = [];
              if (coupon.group_id) {
                users = await userService.getList({
                  where: {
                    group_id: coupon.group_id,
                  },
                  take: limit,
                  skip: limit * page,
                  select: ["id", "group_id"],
                });
              } else {
                users = await userService.getList({
                  take: limit,
                  skip: limit * page,
                  select: ["id"],
                });
              }
              return await Promise.all(
                users.map(
                  async (user) =>
                    await service.giveCoupon(user.id, coupon, {
                      update: false,
                    })
                )
              );
            })
          );
          return await service.updateQuantity(coupon.id);
        })
      );

      // 정규자동발급
      if (now.getDate() === 1) {
        const intervals = await service.getList({
          where: {
            target: Target.INTERVAL,
            created_at: Raw(
              (date) =>
                `CAST(DATE_PART('month', ${date}) AS INTEGER) % interval = CAST(DATE_PART('month', current_date) as  INTEGER) % interval`
            ),
            user_id: IsNull(),
            ends_at: Or(IsNull(), MoreThan(now)),
          },
        });
        await Promise.all(
          intervals.map(async (interval) => {
            let count = 0;
            if (interval.group_id) {
              count = await userService.getCount({
                where: {
                  group_id: interval.group_id,
                },
              });
            } else {
              count = await userService.getCount();
            }
            if (count === 0) return;
            const max = Math.ceil(count / limit);
            await Promise.all(
              Array.from({ length: max }).map(async (_, page) => {
                let users: User[] = [];
                if (interval.group_id) {
                  users = await userService.getList({
                    where: {
                      group_id: interval.group_id,
                    },
                    take: limit,
                    skip: limit * page,
                    select: ["id", "group_id"],
                  });
                } else {
                  users = await userService.getList({
                    take: limit,
                    skip: limit * page,
                    select: ["id"],
                  });
                }
                return await Promise.all(
                  users.map(
                    async (user) =>
                      await service.giveCoupon(user.id, interval, {
                        update: false,
                      })
                  )
                );
              })
            );
            return service.updateQuantity(interval.id);
          })
        );
      }
    },
    {}
  );
}
