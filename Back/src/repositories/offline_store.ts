import { BaseRepository } from "data-source";
import { OfflineStore } from "models/offline_store";
import { Recent } from "models/recent";
import { inject, injectable } from "tsyringe";
import { EntityManager } from "typeorm";

@injectable()
export class OfflineStoreRepository extends BaseRepository<OfflineStore> {
  constructor(@inject("dataSource") public readonly manager: EntityManager) {
    super(manager, OfflineStore);
  }
}
