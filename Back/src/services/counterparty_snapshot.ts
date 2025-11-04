import { inject, injectable } from "tsyringe";
import { BaseService } from "data-source";
import { CounterpartySnapshotRepository } from "repositories/counterparty_snapshot";
import { CounterpartySnapshot } from "models/counterparty_snapshot";
import { CounterpartyRepository } from "repositories/counterparty";

@injectable()
export class CounterpartySnapshotService extends BaseService<
  CounterpartySnapshot,
  CounterpartySnapshotRepository
> {
  constructor(
    @inject(CounterpartySnapshotRepository)
    repo: CounterpartySnapshotRepository,
    @inject(CounterpartyRepository)
    private readonly counterpartyRepo: CounterpartyRepository
  ) {
    super(repo);
  }

  buildWhere(q?: string, store_id?: string, contract_id?: string) {
    let where: any = {};
    if (q) where = this.Search(where, ["name", "email", "biz_no"], q);
    if (store_id) where.store_id = store_id;
    if (contract_id) where.contract_id = contract_id;
    return where;
  }

  // Counterparty → Snapshot 복제
  async syncFromCounterparty(counterparty_id: string, contract_id: string) {
    const source = await this.counterpartyRepo.findOne({
      where: { id: counterparty_id },
    });
    if (!source) throw new Error("counterparty_not_found");

    const snapshot = {
      store_id: source.store_id,
      source_id: source.id,
      contract_id,
      name: source.name,
      email: source.email,
      phone: source.phone,
      biz_no: source.biz_no,
      channel: source.channel,
      bank: source.bank,
      bank_account: source.bank_account,
      metadata: source.metadata,
    };

    return await this.repository.create(snapshot);
  }
}
