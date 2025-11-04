import { inject, injectable } from "tsyringe";
import { BaseService } from "data-source";
import { ApprovalRepository } from "repositories/approval";
import { Approval } from "models/approval";

@injectable()
export class ApprovalService extends BaseService<
  Approval,
  ApprovalRepository
> {
  constructor(@inject(ApprovalRepository) repo: ApprovalRepository) {
    super(repo);
  }

  buildWhere(q?: string, store_id?: string, contract_id?: string, status?: string) {
    let where: any = {};
    if (q) where = this.Search(where, ["approver_name", "approver_email"], q);
    if (store_id) where.store_id = store_id;
    if (contract_id) where.contract_id = contract_id;
    if (status) where.status = status;
    return where;
  }

  // 승인 처리
  async approve(id: string, metadata?: Record<string, unknown>) {
    const approval = await this.getById(id);
    if (!approval) throw new Error("approval_not_found");

    approval.status = "approved";
    approval.approved_at = new Date();
    approval.metadata = { ...(approval.metadata || {}), ...(metadata || {}) };

    return await this.repository.save(approval);
  }

  // 반려 처리
  async reject(id: string, reason?: string) {
    const approval = await this.getById(id);
    if (!approval) throw new Error("approval_not_found");

    approval.status = "rejected";
    approval.rejected_at = new Date();
    approval.metadata = { ...(approval.metadata || {}), rejected_reason: reason };

    return await this.repository.save(approval);
  }

  // 승인 여부 조회
  async isApproved(contract_id: string): Promise<boolean> {
    const approval = await this.repository.findOne({
      where: { contract_id, status: "approved" },
    });
    return !!approval;
  }
}
