import { inject, injectable } from "tsyringe";
import { BaseService } from "data-source";
import { ContractTemplateRepository } from "repositories/contract_template";
import { ContractTemplate } from "models/contract_template";

@injectable()
export class ContractTemplateService extends BaseService<
  ContractTemplate,
  ContractTemplateRepository
> {
  constructor(@inject(ContractTemplateRepository) repo: ContractTemplateRepository) {
    super(repo);
  }

  buildWhere(q?: string, store_id?: string, isDefault?: boolean) {
    let where: any = {};
    if (q) where = this.Search(where, ["name", "body"], q);
    if (store_id) where.store_id = store_id;
    if (typeof isDefault === "boolean") where.default = isDefault;
    return where;
  }

  // 기본 템플릿 조회
  async getDefault(store_id: string) {
    return await this.repository.findOne({
      where: { store_id, default: true },
    });
  }

  // 기본 템플릿 지정 (기존 기본 해제 후 갱신)
  async setDefault(id: string, store_id: string) {
    await this.repository.update({ store_id }, { default: false });
    await this.update({ id }, { default: true });
    return await this.getById(id);
  }
}
