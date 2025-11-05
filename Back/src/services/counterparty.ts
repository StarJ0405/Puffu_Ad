import { inject, injectable } from "tsyringe";
import { BaseService } from "data-source";
import { CounterpartyRepository } from "repositories/counterparty";
import { Counterparty } from "models/counterparty";
import { User } from "models/user";

@injectable()
export class CounterpartyService extends BaseService<
  Counterparty,
  CounterpartyRepository
> {
  constructor(@inject(CounterpartyRepository) repo: CounterpartyRepository) {
    super(repo);
  }

  buildWhere(q?: string, status?: string, store_id?: string, tag?: string) {
    let where: any = {};
    if (q) where = this.Search(where, ["name", "email", "biz_no"], q);
    if (status) where.status = status;
    if (store_id) where.store_id = store_id;
    if (tag) where.tags = tag;
    return where;
  }

  // 활성 상태 피계약자 목록
  async getActiveList(store_id: string) {
    return await this.repository.findAll({
      where: { store_id, status: "active" },
      order: { name: "ASC" },
    });
  }

  // 회원 기반 피계약자 조회 or 생성
  async findOrCreateByUser(user: User, store_id: string) {
    let found = await this.repository.findOne({
      where: [{ user_id: user.id, store_id }, { email: user.email, store_id }],
    });
    if (found) return found;

    const newCtrp = await this.repository.create({
      store_id,
      user_id: user.id,
      name: user.name || user.username,
      email: user.email,
      phone: user.phone,
      status: "active",
      metadata: {},
      tags: [], 
    });
    return await this.repository.save(newCtrp);
  }

  // 회원으로부터 신규 피계약자 생성
  async createFromUser(user: User, store_id: string) {
    const newCtrp = await this.repository.create({
      store_id,
      user_id: user.id,
      name: user.name || user.username,
      email: user.email,
      phone: user.phone,
      status: "active",
      metadata: {},
      tags: [],
    });
    return await this.repository.save(newCtrp);
  }

  // 중복된 피계약자 병합 (biz_no 기준)
  async mergeDuplicates(store_id: string) {
    const items = await this.repository.findAll({ where: { store_id } });
    const map = new Map<string, Counterparty>();

    for (const it of items) {
      if (it.biz_no && map.has(it.biz_no)) {
        const base = map.get(it.biz_no)!;
        base.tags = Array.from(
          new Set([...(base.tags || []), ...(it.tags || [])])
        );
        await this.repository.delete({ id: it.id }, true);
        await this.repository.save(base);
      } else if (it.biz_no) {
        map.set(it.biz_no, it);
      }
    }
  }
}
