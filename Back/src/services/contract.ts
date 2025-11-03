import { injectable } from "tsyringe";
import { EntityManager } from "typeorm";
import { Contract } from "models/contract";
import { BaseRepository, BaseService } from "data-source";

@injectable()
export class ContractRepository extends BaseRepository<Contract> {
  constructor(manager: EntityManager) {
    super(manager, Contract);
  }
}

@injectable()
export class ContractService extends BaseService<
  Contract,
  ContractRepository
> {
  constructor(repository: ContractRepository) {
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
    if (q) where.title = this.Search({}, "title", q);
    if (status) where.status = status;
    if (store_id) where.store_id = store_id;
    if (counterparty_id) where.counterparty_id = counterparty_id;
    if (tag) where.tags = this.Search({}, "tags", tag);
    return where;
  }
}
