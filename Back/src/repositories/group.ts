import { BaseRepository } from "data-source";
import { Group } from "models/group";
import { inject, injectable } from "tsyringe";
import { EntityManager } from "typeorm";

@injectable()
export class GroupRepository extends BaseRepository<Group> {
  constructor(@inject("dataSource") public readonly manager: EntityManager) {
    super(manager, Group);
  }
}
