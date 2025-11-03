import { BaseService, BaseRepository } from "data-source";
import { EntityManager, ILike } from "typeorm";
import { Counterparty } from "models/counterparty";

class CounterpartyRepository extends BaseRepository<Counterparty> {
  constructor(manager: EntityManager) {
    super(manager, Counterparty);
  }
}

export class CounterpartyService extends BaseService<Counterparty, CounterpartyRepository> {
  constructor(manager: EntityManager) {
    super(new CounterpartyRepository(manager));
  }

  buildWhere(q?: string, status?: string, store_id?: string, tag?: string) {
    const where: any = {};
    if (store_id) where.store_id = store_id;
    if (status) where.status = status;
    if (tag) where.tags = { $contains: [tag] } as any; // PG array contains
    if (q) {
      return [
        { ...where, name: ILike(`%${q}%`) },
        { ...where, email: ILike(`%${q}%`) },
        { ...where, phone: ILike(`%${q}%`) },
        { ...where, biz_no: ILike(`%${q}%`) },
      ];
    }
    return where;
  }
}
