import { BaseRepository } from "data-source";
import { Recommend } from "models/recommend";
import { inject, injectable } from "tsyringe";
import { EntityManager } from "typeorm";

@injectable()
export class RecommendRepository extends BaseRepository<Recommend> {
  constructor(@inject("dataSource") public readonly manager: EntityManager) {
    super(manager, Recommend);
  }
}
