import { injectable } from "tsyringe";
import { EntityManager } from "typeorm";
import { Approval } from "models/approval";
import { BaseRepository, BaseService } from "data-source";

@injectable()
export class ApprovalRepository extends BaseRepository<Approval> {
  constructor(manager: EntityManager) {
    super(manager, Approval);
  }
}

@injectable()
export class ApprovalService extends BaseService<Approval, ApprovalRepository> {
  constructor(repository: ApprovalRepository) {
    super(repository);
  }

  buildWhere(
    contract_id?: string,
    approver_id?: string,
    status?: string
  ) {
    const where: any = {};
    if (contract_id) where.contract_id = contract_id;
    if (approver_id) where.approver_id = approver_id;
    if (status) where.status = status; // 'pending' | 'approved' | 'rejected' 등
    return where;
  }
}
