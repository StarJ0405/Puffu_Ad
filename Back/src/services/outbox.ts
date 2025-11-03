import { injectable } from "tsyringe";
import { EntityManager } from "typeorm";
import { BaseRepository, BaseService } from "data-source";
import { Outbox } from "models/outbox";

@injectable()
export class OutboxRepository extends BaseRepository<Outbox> {
  constructor(manager: EntityManager) {
    super(manager, Outbox);
  }
}

@injectable()
export class OutboxService extends BaseService<Outbox, OutboxRepository> {
  constructor(repository: OutboxRepository) {
    super(repository);
  }

  buildWhere(
    q?: string,            // payload JSON 검색용 선택
    endpoint_id?: string,
    event_id?: string,
    status?: string
  ) {
    const where: any = {};
    if (q) where.payload = this.Search({}, "payload", q); // payload text 검색 시만
    if (endpoint_id) where.endpoint_id = endpoint_id;
    if (event_id) where.event_id = event_id;
    if (status) where.status = status;
    return where;
  }
}
