import { injectable, inject } from "tsyringe";
import { EntityManager } from "typeorm";
import { BaseRepository } from "data-source";
import { Evidence } from "models/evidence";

@injectable()
export class EvidenceRepository extends BaseRepository<Evidence> {
  constructor(@inject("dataSource") manager: EntityManager) {
    super(manager, Evidence);
  }
}
