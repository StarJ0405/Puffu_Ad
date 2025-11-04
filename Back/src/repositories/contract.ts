import { injectable, inject } from "tsyringe";
import { EntityManager } from "typeorm";
import { BaseRepository } from "data-source";
import { Contract } from "models/contract";

@injectable()
export class ContractRepository extends BaseRepository<Contract> {
  constructor(@inject("dataSource") manager: EntityManager) {
    super(manager, Contract);
  }
}
