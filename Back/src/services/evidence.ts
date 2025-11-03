import { injectable } from "tsyringe";
import { EntityManager } from "typeorm";
import { Evidence } from "models/evidence";
import { BaseRepository, BaseService } from "data-source";

@injectable()
export class EvidenceRepository extends BaseRepository<Evidence> {
  constructor(manager: EntityManager) {
    super(manager, Evidence);
  }
}

@injectable()
export class EvidenceService extends BaseService<Evidence, EvidenceRepository> {
  constructor(repository: EvidenceRepository) {
    super(repository);
  }

  buildWhere(
    contract_id?: string,
    file_bucket?: string,
    file_key?: string
  ) {
    const where: any = {};
    if (contract_id) where.contract_id = contract_id;
    if (file_bucket) where.file_bucket = file_bucket;
    if (file_key) where.file_key = file_key;
    return where;
  }
}
