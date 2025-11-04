import { injectable, inject } from "tsyringe";
import { EntityManager } from "typeorm";
import { BaseRepository } from "data-source";
import { Outbox } from "models/outbox";

@injectable()
export class OutboxRepository extends BaseRepository<Outbox> {
  constructor(@inject("dataSource") manager: EntityManager) {
    super(manager, Outbox);
  }
}
