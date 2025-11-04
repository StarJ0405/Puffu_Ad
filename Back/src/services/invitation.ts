import { inject, injectable } from "tsyringe";
import { BaseService } from "data-source";
import { InvitationRepository } from "repositories/invitation";
import { Invitation } from "models/invitation";

@injectable()
export class InvitationService extends BaseService<
  Invitation,
  InvitationRepository
> {
  constructor(@inject(InvitationRepository) repo: InvitationRepository) {
    super(repo);
  }

  buildWhere(
    q?: string,
    contract_id?: string,
    store_id?: string,
    status?: string
  ) {
    let where: any = {};
    if (q) where = this.Search(where, ["email", "name", "token"], q);
    if (contract_id) where.contract_id = contract_id;
    if (store_id) where.store_id = store_id;
    if (status) where.status = status;
    return where;
  }

  // 초대 생성 (token 중복 방지)
  async createInvitation(data: Partial<Invitation>) {
    const existing = await this.repository.findOne({
      where: { token: data.token },
    });
    if (existing) return existing;
    return await this.create(data as any);
  }

  // 초대 만료 처리
  async expire(token: string, reason?: string) {
    const invitation = await this.repository.findOne({ where: { token } });
    if (!invitation) throw new Error("invitation_not_found");

    invitation.accepted = false;
    invitation.metadata = {
      ...(invitation.metadata || {}),
      expired_reason: reason,
      expired_at: new Date(),
    };

    return await this.repository.save(invitation);
  }

  // 초대 수락
  async accept(token: string) {
    const invitation = await this.repository.findOne({ where: { token } });
    if (!invitation) throw new Error("invitation_not_found");

    invitation.accepted = true;
    invitation.accepted_at = new Date();
    return await this.repository.save(invitation);
  }

  // 유효성 검사
  async validate(token: string) {
    const invitation = await this.repository.findOne({ where: { token } });
    if (!invitation) throw new Error("invitation_not_found");

    const expired = invitation.expires_at && invitation.expires_at < new Date();
    return { valid: !expired && !invitation.accepted, invitation };
  }
}
