import { BaseRepository } from "data-source";
import { Contract } from "models/contract";
import { injectable, inject } from "tsyringe";
import { EntityManager } from "typeorm";

@injectable()
export class ContractRepository extends BaseRepository<Contract> {
  constructor(@inject("dataSource") public readonly manager: EntityManager) {
    super(manager, Contract);
  }
}
