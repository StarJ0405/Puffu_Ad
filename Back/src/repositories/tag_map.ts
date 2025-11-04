import { injectable, inject } from "tsyringe";
import { EntityManager } from "typeorm";
import { BaseRepository } from "data-source";
import { TagMap } from "models/tag_map";

@injectable()
export class TagMapRepository extends BaseRepository<TagMap> {
  constructor(@inject("dataSource") manager: EntityManager) {
    super(manager, TagMap);
  }
}
