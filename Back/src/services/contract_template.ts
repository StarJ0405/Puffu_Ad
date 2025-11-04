import { injectable } from "tsyringe";
import { EntityManager } from "typeorm";
import { BaseRepository, BaseService } from "data-source";
import { ContractTemplate } from "models/contract_template";

@injectable()
export class ContractTemplateRepository extends BaseRepository<ContractTemplate> {
  constructor(manager: EntityManager) {
    super(manager, ContractTemplate);
  }
}

@injectable()
export class ContractTemplateService extends BaseService<
  ContractTemplate,
  ContractTemplateRepository
> {
  constructor(repository: ContractTemplateRepository) {
    super(repository);
  }

  buildWhere(q?: string, store_id?: string, status?: string, is_default?: string) {
    const where: any = {};
    if (q) where.name = this.Search({}, "name", q);
    if (store_id) where.store_id = store_id;
    if (status) where.status = status;           // 예: 'active' | 'inactive'
    if (typeof is_default !== "undefined") {
      if (is_default === "true") where.is_default = true;
      if (is_default === "false") where.is_default = false;
    }
    return where;
  }
}
