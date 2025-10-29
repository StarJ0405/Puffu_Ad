import lunisolar from "lunisolar";
import { CalcType, Condition, CouponType, Target } from "models/coupon";
import { User } from "models/user";
import { CouponService } from "services/coupon";
import { SubscribeService } from "services/subscribe";
import { UserService } from "services/user";
import { container } from "tsyringe";
import { IsNull, LessThanOrEqual, MoreThan, Not, Or, Raw } from "typeorm";
import { schedule } from "../module";
import { Coupon } from "models/coupon";

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
      if (now.getDate() === 1 || process.env.FORCE_SUBSCRIPTION_COUPON === "true") {
        console.log("[cron] sub monthly start", now.toISOString());
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
      // 크론: 매월 1일 구독 쿠폰 발급 + 만료 구독 회수
      // if (now.getDate() === 1 || process.env.FORCE_SUBSCRIPTION_COUPON === "true") {
      if (now.getDate() === 1) {
        const subscribeService = container.resolve(SubscribeService);
        const couponService = container.resolve(CouponService);

        // 1) 활성 구독 조회: canceled_at IS NULL 추가
        const activeSubs = await subscribeService.getList({
          where: {
            user_id: Not(IsNull()),
            canceled_at: IsNull(),
            starts_at: LessThanOrEqual(now),
            ends_at: MoreThan(now),
            value: MoreThan(0),
          },
          select: ["id", "store_id", "user_id", "name", "value"],
        });
        console.log("[cron] activeSubs", activeSubs.length);


        // 이번 달 기간
        const start_date = new Date();
        start_date.setHours(0, 0, 0, 0);
        start_date.setDate(1);
        const end_date = new Date(start_date);
        end_date.setMonth(end_date.getMonth() + 1);
        end_date.setDate(0);
        end_date.setHours(23, 59, 59, 999);

        // 2) 월 쿠폰 발급: is_subscription + subscription_id 세팅
        await Promise.all(
          activeSubs.map((sub) =>
            couponService.create({
              store_id: sub.store_id,
              name: `${sub.name} ${now.getMonth() + 1}월 쿠폰`,
              type: CouponType.ORDER,
              calc: CalcType.FIX,
              value: sub.value,
              user_id: sub.user_id || undefined,
              starts_at: start_date,
              ends_at: end_date,
              is_subscription: true,
              subscription_id: sub.id,
            })
          )
        );

        // 3) 만료된 구독의 미사용 구독쿠폰 회수
        const expired = await subscribeService.getList({
          where: {
            user_id: Not(IsNull()),
            ends_at: LessThanOrEqual(new Date()),
            value: MoreThan(0),
          },
          select: ["id"],
        });

        if (expired.length) {
          await Promise.all(
            expired.map((s) =>
              couponService.revokeUnusedSubscriptionCoupons(s.id)
            )
          );
        }
      }
    },{ timezone: "Asia/Seoul" } 
  );
}
