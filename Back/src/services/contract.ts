import { inject, injectable } from "tsyringe";
import { BaseService } from "data-source";
import { Contract } from "models/contract";
import { ContractRepository } from "repositories/contract";
import { Page } from "models/page";
import { InputField } from "models/input_field";
import { ContractUser, ApproveStatus } from "models/contract_user";
import { Log } from "models/log";
import { IsNull } from "typeorm";

@injectable()
export class ContractService extends BaseService<Contract, ContractRepository> {
  constructor(@inject(ContractRepository) repo: ContractRepository) {
    super(repo);
  }

  /** 템플릿 생성 (origin_id = null) */
  async createTemplate(payload: any) {
    return this.repository.manager.transaction(async (manager) => {
      const contract = manager.create(Contract, {
        name: payload.name,
        origin_id: null,
        pages: payload.pages?.map((p: any) => {
          const page = new Page();
          page.image = p.image;
          page.page = p.page;
          page.input_fields = p.input_fields?.map((f: any) => {
            const field = new InputField();
            field.type = f.type;
            field.metadata = f.metadata ?? {};
            field.value = {};
            return field;
          });
          return page;
        }),
        contract_users:
          payload.contract_users?.map((u: any) => {
            const cu = new ContractUser();
            cu.name = u.name;
            cu.user_id = u.user_id ?? null;
            cu.approve = ApproveStatus.PENDING;
            return cu;
          }) ?? [],
      });

      await manager.save(contract);

      const log = manager.create(Log, {
        name: "template_create",
        type: "contract",
        data: { contract_id: contract.id, action: "create_template" },
      });
      await manager.save(log);

      return contract;
    });
  }

  /** 템플릿으로부터 계약 생성 */
  async createFromTemplate(template_id: string, payload: any) {
    return this.repository.manager.transaction(async (manager) => {
      const template = await manager.findOne(Contract, {
        where: { id: template_id, origin_id: IsNull() },
        relations: ["pages", "pages.input_fields"],
      });
      if (!template) throw new Error("Template not found");

      const contract = manager.create(Contract, {
        name: payload.name ?? template.name,
        origin_id: template.id,
        pages: template.pages?.map((p) => {
          const page = new Page();
          page.image = p.image;
          page.page = p.page;
          page.input_fields = p.input_fields?.map((f) => {
            const field = new InputField();
            field.type = f.type;
            field.metadata = f.metadata ?? {};
            field.value = {};
            return field;
          });
          return page;
        }),
        contract_users:
          payload.contract_users?.map((u: any) => {
            const cu = new ContractUser();
            cu.name = u.name;
            cu.user_id = u.user_id ?? null;
            cu.approve = ApproveStatus.PENDING;
            return cu;
          }) ?? [],
      });

      await manager.save(contract);

      const log = manager.create(Log, {
        name: "contract_create",
        type: "contract",
        data: { contract_id: contract.id, origin_id: template.id },
      });
      await manager.save(log);

      return contract;
    });
  }

  /** 계약 수정 (페이지, 입력필드 포함) */
  async updateContract(id: string, payload: any) {
    return this.repository.manager.transaction(async (manager) => {
      const contract = await manager.findOne(Contract, {
        where: { id },
        relations: ["pages", "pages.input_fields", "contract_users"],
      });
      if (!contract) throw new Error("Contract not found");

      // 이름 갱신
      if (payload.name) contract.name = payload.name;

      // 페이지 갱신
      if (payload.pages) {
        contract.pages = payload.pages.map((p: any) => {
          const page = new Page();
          page.id = p.id;
          page.image = p.image;
          page.page = p.page;
          page.input_fields = p.input_fields?.map((f: any) => {
            const field = new InputField();
            field.id = f.id;
            field.type = f.type;
            field.metadata = f.metadata ?? {};
            field.value = f.value ?? {};
            return field;
          });
          return page;
        });
      }

      // 참여자 갱신
      if (payload.contract_users) {
        contract.contract_users = payload.contract_users.map((u: any) => {
          const cu = new ContractUser();
          cu.id = u.id;
          cu.name = u.name;
          cu.user_id = u.user_id ?? null;
          cu.approve = u.approve ?? ApproveStatus.PENDING;
          return cu;
        });
      }

      await manager.save(contract);

      const log = manager.create(Log, {
        name: "contract_update",
        type: "contract",
        data: { contract_id: id, action: "update" },
      });
      await manager.save(log);

      return contract;
    });
  }

  /** 계약 완료 처리 */
  async completeContract(id: string) {
    return this.repository.manager.transaction(async (manager) => {
      const contract = await manager.findOne(Contract, {
        where: { id },
        relations: ["contract_users"],
      });
      if (!contract) throw new Error("Contract not found");

      const allConfirmed = contract.contract_users?.every(
        (u) => u.approve === ApproveStatus.CONFIRM
      );
      if (!allConfirmed)
        throw new Error("All users must confirm before completion");

      contract.completed_at = new Date();
      await manager.save(contract);

      const log = manager.create(Log, {
        name: "contract_complete",
        type: "contract",
        data: { contract_id: id },
      });
      await manager.save(log);
    });
  }

  /** 계약 삭제 */
  async deleteContract(id: string) {
    const contract = await this.repository.findOne({ where: { id } });
    if (!contract) return;

    if (!contract.origin_id) await this.repository.delete({ id }); // 템플릿
    else await this.repository.update({ id }, { deleted_at: new Date() }); // 계약

    const log = this.repository.manager.create(Log, {
      name: "contract_delete",
      type: "contract",
      data: { contract_id: id },
    });
    await this.repository.manager.save(log);
  }

  /** 동일 템플릿 기반 계약 버전 목록 */
  async getVersions(origin_id: string) {
    return this.repository.findAll({
      where: { origin_id },
      order: { created_at: "DESC" },
    });
  }
}
