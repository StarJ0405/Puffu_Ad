import { inject, injectable } from "tsyringe";
import { BaseService } from "data-source";
import { ContractUser, ApproveStatus } from "models/contract_user";
import { ContractUserRepository } from "repositories/contract_user";
import { Log } from "models/log";

@injectable()
export class ContractUserService extends BaseService<
  ContractUser,
  ContractUserRepository
> {
  constructor(@inject(ContractUserRepository) repo: ContractUserRepository) {
    super(repo);
  }

  /** 참여자 목록 조회 */
  async getUsers(contract_id: string) {
    return this.repository.findAll({
      where: { contract_id },
      relations: ["user"],
      order: { created_at: "ASC" },
    });
  }

  /** 참여자 추가 */
  async addUser(contract_id: string, user_id: string, name?: string) {
    const cu = await this.repository.create({
      contract_id,
      user_id,
      name,
      approve: ApproveStatus.PENDING,
    });

    await this.repository.manager.save(Log, {
      name: "contract_user_add",
      type: "contract_user",
      data: { contract_id, user_id },
    });

    return cu;
  }

  /** 상태 변경 (pending → ready → confirm) */
  async updateApproveStatus(
    contract_id: string,
    user_id: string,
    status: ApproveStatus
  ) {
    const user = await this.repository.findOne({
      where: { contract_id, user_id },
    });
    if (!user) throw new Error("Contract user not found");

    await this.repository.update({ id: user.id }, { approve: status });

    await this.repository.manager.save(Log, {
      name: "contract_user_update",
      type: "contract_user",
      data: { contract_id, user_id, status },
    });

    return { ...user, approve: status };
  }

  /** 참여자 삭제 */
  async removeUser(id: string) {
    await this.repository.delete({ id });

    await this.repository.manager.save(Log, {
      name: "contract_user_delete",
      type: "contract_user",
      data: { contract_user_id: id },
    });
  }

  /** 모든 참여자가 confirm 되었는지 확인 */
  async isAllConfirmed(contract_id: string): Promise<boolean> {
    const users = await this.repository.findAll({ where: { contract_id } });
    return users.every((u) => u.approve === ApproveStatus.CONFIRM);
  }
}
