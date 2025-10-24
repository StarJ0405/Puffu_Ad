import { insertDocument, insertIntention } from "expand/chatbot/module";
import { Order } from "models/order";
import { OrderService } from "services/order";
import { container } from "tsyringe";
import {
  EntitySubscriberInterface,
  EventSubscriber as TypeormEventSubscriber,
  InsertEvent,
  UpdateEvent,
} from "typeorm";
import { orderToDocument } from "utils/data";

@TypeormEventSubscriber()
export class OrderSubscriber implements EntitySubscriberInterface<Order> {
  listenTo() {
    return Order;
  }
  async afterUpdate(event: UpdateEvent<Order>): Promise<void> {
    const id = event?.entity?.id;
    const service = container.resolve(OrderService);
    const _order = await service.get({
      where: { id },
      relations: [
        "user",
        "address",
        "shipping_method.coupons",
        "items.coupons",
        "items.refunds",
        "items.exchanges",
        "coupons",
      ],
    });
    if (id && _order) {
      const document = orderToDocument(_order);
      await insertDocument([document], "ORDER");
      if (_order.display) await insertIntention([_order.display], "ORDER");
    }
  }

  async afterInsert(event: InsertEvent<Order>): Promise<void> {
    const id = event.entityId;
    if (id) {
      const service = container.resolve(OrderService);
      const _order = await service.get({
        where: { id: String(id) },
        relations: [
          "user",
          "address",
          "shipping_method.coupons",
          "items.coupons",
          "items.refunds",
          "items.exchanges",
          "coupons",
        ],
      });
      if (_order) {
        const document = orderToDocument(_order);
        await insertDocument([document], "ORDER");
        if (_order.display) await insertIntention([_order.display], "ORDER");
      }
    }
  }
}
