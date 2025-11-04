import { inject, injectable } from "tsyringe";
import { BaseService } from "data-source";
import { ContractRepository } from "repositories/contract";
import { Contract } from "models/contract";
import { ContractVersionService } from "services/contract_version";
import { CounterpartySnapshotService } from "services/counterparty_snapshot";

@injectable()
export class ContractService extends BaseService<
  Contract,
  ContractRepository
> {
  constructor(
    @inject(ContractRepository)
    repo: ContractRepository,
    @inject(ContractVersionService)
    private readonly versionService: ContractVersionService,
    @inject(CounterpartySnapshotService)
    private readonly snapshotService: CounterpartySnapshotService
  ) {
    super(repo);
  }

  buildWhere(q?: string, status?: string, store_id?: string, tag?: string) {
    let where: any = {};
    if (q) where = this.Search(where, ["title", "id"], q);
    if (status) where.status = status;
    if (store_id) where.store_id = store_id;
    if (tag) where.tags = tag;
    return where;
  }

  // 계약 생성 + 스냅샷 + 초기 버전 동시 생성
  async createWithVersionAndSnapshot(
    contractData: Partial<Contract>,
    versionBody: string
  ) {
    return await this.withTransaction(async (tx) => {
      // 계약 생성
      const contract = await tx.create(contractData);

      // CounterpartySnapshot 생성
      if (contract.counterparty_id) {
        await this.snapshotService.syncFromCounterparty(
          contract.counterparty_id,
          contract.id
        );
      }

      // 초기 버전 생성
      await this.versionService.create({
        contract_id: contract.id,
        v_no: 1,
        body: versionBody,
        locked: false,
      });

      return contract;
    });
  }

  // 계약 종료(해지)
  async terminate(id: string, reason?: string) {
    const contract = await this.getById(id);
    if (!contract) throw new Error("contract_not_found");
    contract.status = "terminated";
    contract.metadata = {
      ...(contract.metadata || {}),
      terminated_reason: reason,
      terminated_at: new Date(),
    };
    return await this.repository.save(contract);
  }

  // 계약 요약 (버전 포함)
  async getSummary(id: string) {
    const contract = await this.getById(id);
    const version = await this.versionService.getLatestVersion(id);
    return { ...contract, latest_version: version };
  }
}
