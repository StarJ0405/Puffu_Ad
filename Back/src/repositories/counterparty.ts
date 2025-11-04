import { injectable, inject } from "tsyringe";
import { EntityManager } from "typeorm";
import { BaseRepository } from "data-source";
import { Counterparty } from "models/counterparty";

@injectable()
export class CounterpartyRepository extends BaseRepository<Counterparty> {
  constructor(@inject("dataSource") manager: EntityManager) {
    super(manager, Counterparty);
  }
}
