import { BaseRepository } from "data-source";
import { ContractUser } from "models/contract_user";
import { injectable, inject } from "tsyringe";
import { EntityManager } from "typeorm";

@injectable()
export class ContractUserRepository extends BaseRepository<ContractUser> {
  constructor(@inject("dataSource") public readonly manager: EntityManager) {
    super(manager, ContractUser);
  }
}
