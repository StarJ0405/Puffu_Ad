import axios from "axios";
import { Order, OrderStatus } from "models/order";
import { ShippingType } from "models/shipping_method";
import { OrderService } from "services/order";
import { ShippingMethodService } from "services/shipping_method";
import { container } from "tsyringe";
import { IsNull, Not } from "typeorm";
import { schedule } from "../module";
import { ExchangeService } from "services/exchange";
import { CouponService } from "services/coupon";
interface Progress {
  time: string;
  status: {
    id: string;
    text: string;
  };
  location: {
    name: string;
  };
  description: string;
}

async function ProgressModule(
  tracking_number: string | undefined,
  callback: (progresses: Progress[]) => Promise<void>
) {
  if (!tracking_number) return;
  tracking_number = String(tracking_number).replace(/-/g, "");
  const response = await axios.get(
    `https://apis.tracker.delivery/carriers/kr.cjlogistics/tracks/${tracking_number}`
  );
  const progresses: Progress[] = response?.data?.progresses;
  if (progresses) {
    await callback(progresses);
  }
}

export function regist(DEV: boolean) {
  // 스케줄링된 작업 시작
  schedule(
    // "0 */10 * * * *",
    "*/30 * * * * *",
    async () => {
      const service = container.resolve(OrderService);
      const shippingService = container.resolve(ShippingMethodService);
      const couponService = container.resolve(CouponService);
      const exchangeService = container.resolve(ExchangeService);
      // 배송대기
      {
        const orders = await service.getList({
          where: {
            status: OrderStatus.FULFILLED,
            shipping_method: {
              type: ShippingType.DEFAULT,
              tracking_number: Not(IsNull()),
            },
          },
          relations: ["shipping_method", "items.variant", "user.group"],
        });
        for (const order of orders) {
          await ProgressModule(
            order.shipping_method?.tracking_number,
            async (progresses) => {
              if (
                progresses.some(
                  (progress) => progress?.status?.id === "at_pickup"
                )
              ) {
                await service.update(
                  { id: order.id },
                  {
                    status: OrderStatus.SHIPPING,
                  }
                );
                await couponService.giveOrderCoupon(order);
                await couponService.givePurchaseCoupon(order);
              }
            }
          );
        }
      }
      // 교환 배송대기
      {
        const exchanges = await exchangeService.getList({
          where: {
            completed_at: IsNull(),
            pickup_at: IsNull(),
            tracking_number: Not(IsNull()),
          },
        });
        for (const exchange of exchanges) {
          await ProgressModule(exchange.tracking_number, async (progresses) => {
            const find = progresses.find(
              (progress) => progress?.status?.id === "at_pickup"
            );
            if (find) {
              await exchangeService.update(
                { id: exchange.id },
                {
                  pickup_at: new Date(find.time),
                }
              );
            }
          });
        }
      }
      {
        const orders = await service.getList({
          where: {
            status: OrderStatus.SHIPPING,
            shipping_method: {
              type: ShippingType.DEFAULT,
              tracking_number: Not(IsNull()),
            },
          },
          relations: ["shipping_method"],
        });
        for (const order of orders) {
          await ProgressModule(
            order.shipping_method?.tracking_number,
            async (progresses) => {
              const find = progresses.find(
                (progress) => progress?.status?.id === "delivered"
              );
              if (find) {
                await service.update(
                  { id: order.id },
                  {
                    status: OrderStatus.COMPLETE,
                  }
                );
                await shippingService.update(
                  {
                    order_id: order.id,
                    type: ShippingType.DEFAULT,
                  },
                  {
                    shipped_at: new Date(find.time),
                  }
                );
                await couponService.giveShippingCoupon(order);
                await couponService.giveFirstCoupon(order);
              }
            }
          );
        }
      }
      {
        const exchanges = await exchangeService.getList({
          where: {
            pickup_at: Not(IsNull()),
            completed_at: IsNull(),
            tracking_number: Not(IsNull()),
          },
        });
        for (const exchange of exchanges) {
          await ProgressModule(exchange.tracking_number, async (progresses) => {
            const find = progresses.find(
              (progress) => progress?.status?.id === "delivered"
            );
            if (find) {
              await exchangeService.update(
                { id: exchange.id },
                {
                  completed_at: new Date(find.time),
                }
              );
            }
          });
        }
      }
    },
    {}
  );
}
