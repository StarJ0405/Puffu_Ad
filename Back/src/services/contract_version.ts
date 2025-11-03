import { injectable } from "tsyringe";
import { EntityManager, MoreThanOrEqual, LessThanOrEqual, Between } from "typeorm";
import { ContractVersion } from "models/contract_version";
import { BaseRepository, BaseService } from "data-source";

@injectable()
export class ContractVersionRepository extends BaseRepository<ContractVersion> {
  constructor(manager: EntityManager) {
    super(manager, ContractVersion);
  }
}

@injectable()
export class ContractVersionService extends BaseService<
  ContractVersion,
  ContractVersionRepository
> {
  constructor(repository: ContractVersionRepository) {
    super(repository);
  }

  buildWhere(
    q?: string,
    contract_id?: string,
    v_no?: string,
    locked?: string,
    created_gte?: string,
    created_lte?: string
  ) {
    const where: any = {};
    if (q) where.body = this.Search({}, "body", q);
    if (contract_id) where.contract_id = contract_id;
    if (v_no && !Number.isNaN(Number(v_no))) where.v_no = Number(v_no);
    if (locked === "true" || locked === "false") where.locked = locked === "true";

    if (created_gte && created_lte) {
      where.created_at = Between(new Date(created_gte), new Date(created_lte));
    } else if (created_gte) {
      where.created_at = MoreThanOrEqual(new Date(created_gte));
    } else if (created_lte) {
      where.created_at = LessThanOrEqual(new Date(created_lte));
    }

    return where;
  }
}
