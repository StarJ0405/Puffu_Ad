import { injectable, inject } from "tsyringe";
import { EntityManager } from "typeorm";
import { BaseRepository } from "data-source";
import { Approval } from "models/approval";

@injectable()
export class ApprovalRepository extends BaseRepository<Approval> {
  constructor(@inject("dataSource") manager: EntityManager) {
    super(manager, Approval);
  }
}
