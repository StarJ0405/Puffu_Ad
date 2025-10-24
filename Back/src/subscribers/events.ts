import { insertDocument, insertIntention } from "expand/chatbot/module";
import { Event } from "models/event";
import { EventService } from "services/event";
import { container } from "tsyringe";
import {
  EntitySubscriberInterface,
  InsertEvent,
  EventSubscriber as TypeormEventSubscriber,
  UpdateEvent,
} from "typeorm";
import { eventToDocument } from "utils/data";

@TypeormEventSubscriber()
export class EventSubscriber implements EntitySubscriberInterface<Event> {
  listenTo() {
    return Event;
  }
  async afterUpdate(event: UpdateEvent<Event>): Promise<void> {
    const id = event?.entity?.id;
    const service = container.resolve(EventService);
    const _event = await service.get({
      where: { id },
      relations: [
        "discounts.products.product",
        "discounts.variants.variant",
        "bundles.products.product",
        "bundles.variants.variant.product",
      ],
    });
    if (id && _event) {
      const document = eventToDocument(_event);
      await insertDocument([document], "EVENT");
      if (_event.title) await insertIntention([_event.title], "EVENT");
    }
  }

  async afterInsert(event: InsertEvent<Event>): Promise<void> {
    const id = event.entityId;
    if (id) {
      const service = container.resolve(EventService);
      const _event = await service.get({
        where: { id: String(id) },
        relations: [
          "discounts.products.product",
          "discounts.variants.variant",
          "bundles.products.product",
          "bundles.variants.variant.product",
        ],
      });
      if (_event) {
        const document = eventToDocument(_event);
        await insertDocument([document], "EVENT");
        if (_event.title) await insertIntention([_event.title], "EVENT");
      }
    }
  }
}
