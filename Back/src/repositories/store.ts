import { BaseRepository } from "data-source";
import { Store } from "models/store";
import { inject, injectable } from "tsyringe";
import { EntityManager } from "typeorm";

@injectable()
export class StoreRepository extends BaseRepository<Store> {
  constructor(@inject("dataSource") public readonly manager: EntityManager) {
    super(manager, Store);
  }
}
