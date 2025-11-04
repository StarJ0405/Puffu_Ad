import { injectable, inject } from "tsyringe";
import { EntityManager } from "typeorm";
import { BaseRepository } from "data-source";
import { ContractVersion } from "models/contract_version";

@injectable()
export class ContractVersionRepository extends BaseRepository<ContractVersion> {
  constructor(@inject("dataSource") manager: EntityManager) {
    super(manager, ContractVersion);
  }
}
