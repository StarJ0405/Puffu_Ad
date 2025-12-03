import { BaseRepository } from "data-source";
import { Recent } from "models/recent";
import { RecentStore } from "models/recent_store";
import { inject, injectable } from "tsyringe";
import { EntityManager } from "typeorm";

@injectable()
export class RecentStoreRepository extends BaseRepository<RecentStore> {
  constructor(@inject("dataSource") public readonly manager: EntityManager) {
    super(manager, RecentStore);
  }
}
