import { BaseRepository } from "data-source";
import { Keywords } from "models/keywords";
import { inject, injectable } from "tsyringe";
import { EntityManager } from "typeorm";

@injectable()
export class KeywordsRepository extends BaseRepository<Keywords> {
  constructor(@inject("dataSource") public readonly manager: EntityManager) {
    super(manager, Keywords);
  }
}
