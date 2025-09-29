import axios from "axios";
import { Order, OrderStatus } from "models/order";
import { ShippingType } from "models/shipping_method";
import { OrderService } from "services/order";
import { ShippingMethodService } from "services/shipping_method";
import { container } from "tsyringe";
import { IsNull, Not } from "typeorm";
import { schedule } from "../module";
import { LineItemService } from "services/line_item";

export function regist(DEV: boolean) {
  // 스케줄링된 작업 시작
  schedule(
    // "0 */10 * * * *",
    "*/30 * * * * *",
    async () => {
      const itemService = container.resolve(LineItemService);
      await itemService.confirmations();
    },
    {}
  );
}
