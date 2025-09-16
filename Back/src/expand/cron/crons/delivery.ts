import axios from "axios";
import { Order, OrderStatus } from "models/order";
import { ShippingType } from "models/shipping_method";
import { OrderService } from "services/order";
import { container } from "tsyringe";
import { IsNull, Not } from "typeorm";
import { schedule } from "../module";
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
  order: Order,
  callback: (progresses: Progress[]) => Promise<void>
) {
  let tracking_number = order.shipping_methods?.[0]?.tracking_number;
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
      // 배송대기
      {
        const orders = await service.getList({
          where: {
            status: OrderStatus.FULFILLED,
            shipping_methods: {
              type: ShippingType.DEFAULT,
              tracking_number: Not(IsNull()),
            },
          },
          relations: ["shipping_methods"],
        });
        for (const order of orders) {
          await ProgressModule(order, async (progresses) => {
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
            }
          });
        }
      }
      {
        const orders = await service.getList({
          where: {
            status: OrderStatus.SHIPPING,
            shipping_methods: {
              type: ShippingType.DEFAULT,
              tracking_number: Not(IsNull()),
            },
          },
          relations: ["shipping_methods"],
        });
        for (const order of orders) {
          await ProgressModule(order, async (progresses) => {
            if (
              progresses.some(
                (progress) => progress?.status?.id === "delivered"
              )
            ) {
              await service.update(
                { id: order.id },
                {
                  status: OrderStatus.COMPLETE,
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
