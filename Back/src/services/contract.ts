import { inject, injectable } from "tsyringe";
import { BaseService } from "data-source";
import { Contract } from "models/contract";
import { ContractRepository } from "repositories/contract";
import { Page } from "models/page";
import { InputField } from "models/input_field";
import { ContractUser, ApproveStatus } from "models/contract_user";
import { Log } from "models/log";
import { IsNull } from "typeorm";
import path from "path";

@injectable()
export class ContractService extends BaseService<Contract, ContractRepository> {
  constructor(@inject(ContractRepository) repo: ContractRepository) {
    super(repo);
  }

  async findOne(options: any) {
    return await this.repository.findOne(options);
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

      if (payload.name) contract.name = payload.name;

      if (payload.pages) {
        const oldPages = contract.pages ?? [];

        const finalPages: Page[] = [];

        for (const incomingPage of payload.pages) {
          const oldPage = oldPages.find((p) => p.id === incomingPage.id);

          // 페이지 신규 생성 or 업데이트
          const page = oldPage ?? new Page();
          page.id = incomingPage.id;
          page.image = incomingPage.image;
          page.page = incomingPage.page;

          const oldFields = oldPage?.input_fields ?? [];
          const newFields = incomingPage.input_fields ?? [];

          // 삭제 대상
          const removeTargets = oldFields.filter(
            (old) => !newFields.some((nf: any) => nf.id === old.id)
          );
          if (removeTargets.length) await manager.softRemove(removeTargets);

          // 추가 + 수정
          const finalFields: InputField[] = [];
          for (const nf of newFields) {
            const oldF = oldFields.find((of) => of.id === nf.id);
            const field = oldF ?? new InputField();

            field.id = nf.id;
            field.type = nf.type;
            field.metadata = nf.metadata ?? {};
            field.value = nf.value ?? {};

            finalFields.push(field);
          }

          page.input_fields = finalFields;
          finalPages.push(page);
        }

        contract.pages = finalPages;
      }

      if (payload.contract_users) {
        const existing = contract.contract_users || [];
        const incoming = payload.contract_users || [];

        const removed = existing.filter(
          (old) => !incoming.some((nu: any) => nu.id === old.id)
        );

        const updated = incoming.map((nu: any) => {
          const cu =
            existing.find((old) => old.id === nu.id) || new ContractUser();
          cu.name = nu.name;
          cu.user_id = nu.user_id ?? null;
          cu.approve = nu.approve ?? ApproveStatus.PENDING;
          return cu;
        });
        if (removed.length > 0) {
          await manager.softRemove(removed);
        }
        contract.contract_users = updated;
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

  async updateInputField(fieldId: string, value: any) {
    return this.repository.manager.transaction(async (manager) => {
      const field = await manager.findOne(InputField, {
        where: { id: fieldId },
      });
      if (!field) throw new Error("Input field not found");

      //페이지 + 계약 조회
      const page = await manager.findOne(Page, {
        where: { id: field.page_id },
        relations: ["contract"],
      });

      //완료된 계약 수정 금지
      if (page?.contract?.completed_at) {
        throw new Error("Completed contract cannot be updated");
      }

      field.value = value;
      await manager.save(field);

      const log = manager.create(Log, {
        name: "input_field_update",
        type: "input_field",
        data: { field_id: fieldId },
      });
      await manager.save(log);

      return field;
    });
  }

  async completeContract(id: string) {
    return this.repository.manager.transaction(async (manager) => {
      const contract = await manager.findOne(Contract, {
        where: { id },
        relations: ["contract_users", "pages", "pages.input_fields"],
      });
      if (!contract) throw new Error("Contract not found");

      if (contract.completed_at) {
        throw new Error("Completed contract cannot be updated");
      }

      const allConfirmed = contract.contract_users?.every(
        (u) => u.approve === ApproveStatus.CONFIRM
      );
      if (!allConfirmed)
        throw new Error("All users must confirm before completion");

      contract.completed_at = new Date();

      const { sha256, sha256File } = await import("utils/functions");

      // --- 모든 필드 해시 생성 ---
      for (const page of contract.pages || []) {
        for (const field of page.input_fields || []) {
          // 업로드 타입이면 원본 파일 해시를 value 내부에 고정 저장
          if (field.type === "upload" && field.value?.url) {
            const url = field.value.url;
            const localPath = url.replace(/^https?:\/\/[^\/]+\/uploads\//, "");
            const fullPath = path.join(process.cwd(), "uploads", localPath);
            try {
              const fileHash = sha256File(fullPath);
              field.value.fileHash = fileHash; //new
            } catch (e) {
              console.error("File hash fail:", e);
            }
          }

          // 모든 필드 공통 value_hash 생성
          const valueJson = JSON.stringify(field.value ?? {});
          field.value_hash = sha256(valueJson); //new

          await manager.save(field);
        }
      }

      // --- snapshot 구성 ---
      const snapshot = {
        contract_id: contract.id,
        name: contract.name,
        completed_at: contract.completed_at,
        pages: contract.pages?.map((p) => ({
          page: p.page,
          image: p.image,
          input_fields: p.input_fields?.map((f) => ({
            type: f.type,
            metadata: f.metadata,
            value: f.value, // fileHash 포함
            value_hash: f.value_hash, //new snapshot에 포함해도 무방
          })),
        })),
        participants: contract.contract_users?.map((cu) => ({
          name: cu.name,
          user_id: cu.user_id,
          approve: cu.approve,
        })),
      };

      const finalHash = sha256(JSON.stringify(snapshot));
      (contract as any).final_hash = finalHash;

      await manager.save(contract);

      const log = manager.create(Log, {
        name: "contract_complete",
        type: "contract",
        data: { contract_id: id, final_hash: finalHash },
      });
      await manager.save(log);

      return contract;
    });
  }

  /** 계약 삭제 */
  async deleteContract(id: string) {
    const contract = await this.repository.findOne({ where: { id } });
    if (!contract) return;

    if (!contract.origin_id) {
      // 템플릿 삭제
      await this.repository.delete({ id });
    } else {
      // 계약 삭제 (소프트 삭제 + 플래그)
      await this.repository.update({ id }, { is_delete: new Date() });
    }

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

  /** 참여자 승인 상태 변경 (본인 기준) */
  async updateUserApproveStatus(
    contract_id: string,
    user_id: string,
    approve: string
  ) {
    return this.repository.manager.transaction(async (manager) => {
      const cu = await manager.findOne(ContractUser, {
        where: { contract_id, user_id },
      });
      if (!cu) throw new Error("Contract user not found");

      cu.approve = approve as any;
      await manager.save(cu);

      const log = manager.create(Log, {
        name: "contract_user_update",
        type: "contract_user",
        data: { contract_id, user_id, approve },
      });
      await manager.save(log);

      return cu;
    });
  }

  /** 계약명 / 참여자명 검색 → contract.id 목록 반환 */
  async searchIdsByQuery(q: string): Promise<string[]> {
    const qb = this.repository.manager
      .createQueryBuilder("contract", "c")
      .leftJoin("c.contract_users", "cu")
      .leftJoin("cu.user", "u")
      .where("c.name ILIKE :q", { q: `%${q}%` })
      .orWhere("cu.name ILIKE :q", { q: `%${q}%` })
      .orWhere("u.name ILIKE :q", { q: `%${q}%` })
      .select("c.id", "id");

    const rows = await qb.getRawMany();
    return rows.map((r) => r.id);
  }

  async verifyContractHash(id: string): Promise<boolean> {
    const contract = await this.repository.findOne({
      where: { id },
      relations: ["contract_users", "pages", "pages.input_fields"],
    });
    if (!contract) throw new Error("Contract not found");
    if (!contract.final_hash) return false;

    const { sha256, sha256File } = await import("utils/functions");

    // 1) 업로드 파일 검증
    for (const page of contract.pages || []) {
      for (const field of page.input_fields || []) {
        if (field.type === "upload" && field.value?.url) {
          const url = field.value.url;
          const localPath = url.replace(/^https?:\/\/[^\/]+\/uploads\//, "");
          const fullPath = path.join(process.cwd(), "uploads", localPath);

          try {
            const currentFileHash = sha256File(fullPath);
            if (currentFileHash !== field.value.fileHash) {
              return false;
            }
          } catch (e) {
            console.error("file verify fail:", e);
            return false;
          }
        }

        // 2) value_hash 재검증
        const valueJson = JSON.stringify(field.value ?? {});
        if (field.value_hash !== sha256(valueJson)) {
          return false;
        }
      }
    }

    // 3) 최종 스냅샷 재구성 후 final_hash 비교
    const snapshot = {
      contract_id: contract.id,
      name: contract.name,
      completed_at: contract.completed_at,
      pages: contract.pages?.map((p) => ({
        page: p.page,
        image: p.image,
        input_fields: p.input_fields?.map((f) => ({
          type: f.type,
          metadata: f.metadata,
          value: f.value,
          value_hash: f.value_hash,
        })),
      })),
      participants: contract.contract_users?.map((cu) => ({
        name: cu.name,
        user_id: cu.user_id,
        approve: cu.approve,
      })),
    };

    const newFinalHash = sha256(JSON.stringify(snapshot));
    return newFinalHash === contract.final_hash;
  }
}
