import { inject, injectable } from "tsyringe";
import { BaseService } from "data-source";
import { Contract } from "models/contract";
import { ContractRepository } from "repositories/contract";
import { Page } from "models/page";
import { InputField } from "models/input_field";
import { ContractUser, ApproveStatus } from "models/contract_user";
import { Log } from "models/log";
import { DeepPartial, EntityManager, IsNull } from "typeorm";

@injectable()
export class ContractService extends BaseService<Contract, ContractRepository> {
  constructor(@inject(ContractRepository) repo: ContractRepository) {
    super(repo);
  }

  /** 템플릿 생성 */
  async createTemplate(payload: any) {
    return this.repository.manager.transaction(async (manager) => {
      const template = manager.create(Contract, {
        ...payload,
        origin_id: null,
      });
      await manager.save(template);

      if (payload.pages?.length) {
        for (const p of payload.pages) {
          const page = manager.create(Page, {
            contract_id: template.id,
            image: p.image,
            page: p.page,
          });
          await manager.save(page);

          if (p.input_fields?.length) {
            for (const field of p.input_fields) {
              const newField = manager.create(InputField, {
                page_id: page.id,
                type: field.type,
                metadata: field.metadata ?? {},
                value: {},
              });
              await manager.save(newField);
            }
          }
        }
      }

      const log = manager.create(Log, {
        name: "template_create",
        type: "contract",
        data: { contract_id: template.id, action: "create_template" },
      });
      await manager.save(log);

      return template;
    });
  }

  /** 템플릿 복제 → 계약 생성 */
  async createFromTemplate(templateId: string, payload: any) {
    return this.repository.manager.transaction(async (manager) => {
      const template = await manager.findOne(Contract, {
        where: { id: templateId, origin_id: IsNull() },
        relations: ["pages", "pages.input_fields"],
      });
      if (!template) throw new Error("Template not found");

      const newContract = manager.create(Contract, {
        ...payload,
        origin_id: template.id,
        name: payload.name ?? template.name,
      });
      await manager.save(newContract);

      if (template.pages?.length) {
        for (const page of template.pages) {
          const newPage = manager.create(Page, {
            contract_id: newContract.id,
            image: page.image,
            page: page.page,
          });
          await manager.save(newPage);

          if (page.input_fields?.length) {
            for (const field of page.input_fields) {
              const newField = manager.create(InputField, {
                page_id: newPage.id,
                type: field.type,
                metadata: field.metadata,
                value: {},
              });
              await manager.save(newField);
            }
          }
        }
      }

      if (payload.contract_users?.length) {
        for (const user of payload.contract_users) {
          const cu = manager.create(ContractUser, {
            name: user.name,
            user_id: user.user_id,
            contract_id: newContract.id,
            approve: ApproveStatus.PENDING,
          });
          await manager.save(cu);
        }
      }

      const log = manager.create(Log, {
        name: "contract_create",
        type: "contract",
        data: { contract_id: newContract.id, action: "create" },
        metadata: { origin_id: template.id },
      });
      await manager.save(log);

      return newContract;
    });
  }

  /** 계약 수정 (본문 + 페이지 + 필드 일괄) */
  async updateContractWithPages(
    id: string,
    payload: {
      name?: string;
      pages?: {
        id?: string;
        image?: string;
        page?: number;
        input_fields?: { id?: string; type?: string; metadata?: any; value?: any }[];
      }[];
    },
    user_id?: string
  ) {
    return this.repository.manager.transaction(async (manager) => {
      const contract = await manager.findOne(Contract, {
        where: { id },
        relations: ["pages", "pages.input_fields"],
      });
      if (!contract) throw new Error("Contract not found");

      if (payload.name)
        await manager.update(Contract, { id }, { name: payload.name });

      if (payload.pages?.length) {
        for (const p of payload.pages) {
          let page =
            p.id &&
            (await manager.findOne(Page, { where: { id: p.id, contract_id: id } }));
          if (page) {
            await manager.update(Page, { id: page.id }, { image: p.image, page: p.page });
          } else {
            page = manager.create(Page, { contract_id: id, image: p.image, page: p.page });
            await manager.save(page);
          }

          if (p.input_fields?.length) {
            for (const f of p.input_fields) {
              if (f.id) {
                await manager.update(InputField, { id: f.id }, {
                  type: f.type,
                  metadata: f.metadata,
                  value: f.value,
                });
              } else {
                const nf = manager.create(InputField, {
                  page_id: page.id,
                  type: f.type,
                  metadata: f.metadata ?? {},
                  value: f.value ?? {},
                });
                await manager.save(nf);
              }
            }
          }
        }
      }

      const log = manager.create(Log, {
        name: "contract_update_pages",
        type: "contract",
        data: { contract_id: id, action: "update_pages" },
        metadata: { user_id, payload },
      });
      await manager.save(log);
    });
  }

  /** 완료 처리 */
  async completeContract(id: string) {
    return this.repository.manager.transaction(async (manager) => {
      const users = await manager.find(ContractUser, {
        where: { contract_id: id },
      });
      const allConfirmed = users.every(
        (u) => u.approve === ApproveStatus.CONFIRM
      );
      if (!allConfirmed)
        throw new Error("All users must be confirmed to complete contract");

      await manager.update(Contract, { id }, { completed_at: new Date() });

      const log = manager.create(Log, {
        name: "contract_complete",
        type: "contract",
        data: { contract_id: id, action: "complete" },
      });
      await manager.save(log);
    });
  }

  /** 삭제 (템플릿/계약 분기) */
  async deleteContract(id: string) {
    const contract = await this.repository.findOne({ where: { id } });
    if (!contract) return;

    if (!contract.origin_id) {
      await this.repository.delete({ id }); // 템플릿
    } else {
      await this.repository.update({ id }, { deleted_at: new Date() }); // 계약
    }

    const log = this.repository.manager.create(Log, {
      name: "contract_delete",
      type: "contract",
      data: { contract_id: id, action: "delete" },
    });
    await this.repository.manager.save(log);
  }

  /** 동일 템플릿 기반 계약 목록 조회 */
  async getVersions(origin_id: string) {
    return this.repository.findAll({
      where: { origin_id },
      order: { created_at: "DESC" },
    });
  }
}
