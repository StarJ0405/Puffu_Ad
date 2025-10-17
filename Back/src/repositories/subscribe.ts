import { BaseRepository } from "data-source";
import { Subscribe } from "models/subscribe";
import { inject, injectable } from "tsyringe";
import { EntityManager } from "typeorm";

@injectable()
export class SubscribeRepository extends BaseRepository<Subscribe> {
  constructor(@inject("dataSource") public readonly manager: EntityManager) {
    super(manager, Subscribe);
  }
}
