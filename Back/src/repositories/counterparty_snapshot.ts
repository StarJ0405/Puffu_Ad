import { injectable, inject } from "tsyringe";
import { EntityManager } from "typeorm";
import { BaseRepository } from "data-source";
import { CounterpartySnapshot } from "models/counterparty_snapshot";

@injectable()
export class CounterpartySnapshotRepository extends BaseRepository<CounterpartySnapshot> {
  constructor(@inject("dataSource") manager: EntityManager) {
    super(manager, CounterpartySnapshot);
  }
}
