import { injectable, inject } from "tsyringe";
import { EntityManager } from "typeorm";
import { BaseRepository } from "data-source";
import { ContractTemplate } from "models/contract_template";

@injectable()
export class ContractTemplateRepository extends BaseRepository<ContractTemplate> {
  constructor(@inject("dataSource") manager: EntityManager) {
    super(manager, ContractTemplate);
  }

  async toggleLock(id: string, locked: boolean) {
    return this.update({ id } as any, { locked } as any);
  }
}
