import { inject, injectable } from "tsyringe";
import { BaseService } from "data-source";
import { ContractVersionRepository } from "repositories/contract_version";
import { ContractVersion } from "models/contract_version";

@injectable()
export class ContractVersionService extends BaseService<
  ContractVersion,
  ContractVersionRepository
> {
  constructor(
    @inject(ContractVersionRepository)
    repo: ContractVersionRepository
  ) {
    super(repo);
  }

  buildWhere(q?: string, contract_id?: string, store_id?: string) {
    let where: any = {};
    if (q) where = this.Search(where, ["body"], q);
    if (contract_id) where.contract_id = contract_id;
    if (store_id) where.store_id = store_id;
    return where;
  }

  async getLatestVersion(contract_id: string) {
    return await this.repository.findOne({
      where: { contract_id },
      order: { v_no: "DESC" },
    });
  }

  async lockVersion(id: string) {
    await this.update({ id }, { locked: true });
    return await this.getById(id);
  }
}
