import { injectable } from "tsyringe";
import { EntityManager } from "typeorm";
import { CounterpartySnapshot } from "models/counterparty_snapshot";
import { BaseRepository, BaseService } from "data-source";

@injectable()
export class CounterpartySnapshotRepository extends BaseRepository<CounterpartySnapshot> {
  constructor(manager: EntityManager) {
    super(manager, CounterpartySnapshot);
  }
}

@injectable()
export class CounterpartySnapshotService extends BaseService<
  CounterpartySnapshot,
  CounterpartySnapshotRepository
> {
  constructor(repository: CounterpartySnapshotRepository) {
    super(repository);
  }

  buildWhere(
    q?: string,
    status?: string,
    store_id?: string,
    counterparty_id?: string,
    tag?: string
  ) {
    const where: any = {};
    if (q) where.name = this.Search({}, "name", q);
    if (status) where.status = status;
    if (store_id) where.store_id = store_id;
    if (counterparty_id) where.counterparty_id = counterparty_id;
    if (tag) where.tags = this.Search({}, "tags", tag);
    return where;
  }
}
