import { BaseService } from "data-source";
import { Event } from "models/event";
import { EventRepository } from "repositories/event";

import { inject, injectable } from "tsyringe";

@injectable()
export class EventService extends BaseService<Event, EventRepository> {
  constructor(@inject(EventRepository) eventRepository: EventRepository) {
    super(eventRepository);
  }
}
