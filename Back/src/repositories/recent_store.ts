import { BaseRepository } from "data-source";
import { Recent } from "models/recent";
import { inject, injectable } from "tsyringe";
import { EntityManager } from "typeorm";

@injectable()
export class RecentStoreRepository extends BaseRepository<Recent> {
  constructor(@inject("dataSource") public readonly manager: EntityManager) {
    super(manager, Recent);
  }
}
