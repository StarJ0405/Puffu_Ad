import { injectable } from "tsyringe";
import { EntityManager } from "typeorm";
import { TagMap } from "models/tag_map";
import { BaseRepository, BaseService } from "data-source";

@injectable()
export class TagMapRepository extends BaseRepository<TagMap> {
  constructor(manager: EntityManager) {
    super(manager, TagMap);
  }
}

@injectable()
export class TagMapService extends BaseService<TagMap, TagMapRepository> {
  constructor(repository: TagMapRepository) {
    super(repository);
  }

  buildWhere(contract_id?: string, tag?: string) {
    const where: any = {};
    if (contract_id) where.contract_id = contract_id;
    if (tag) where.tag = tag;
    return where;
  }
}
