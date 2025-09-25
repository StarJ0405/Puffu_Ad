import { BaseService } from "data-source";
import { Group } from "models/group";
import { GroupRepository } from "repositories/group";
import { UserRepository } from "repositories/user";
import { inject, injectable } from "tsyringe";
import { FindManyOptions, FindOneOptions } from "typeorm";

@injectable()
export class GroupService extends BaseService<Group, GroupRepository> {
  constructor(
    @inject(GroupRepository) groupRepository: GroupRepository,
    @inject(UserRepository) userRepository: UserRepository
  ) {
    super(groupRepository);
  }
  async getPageable(
    pageData: PageData,
    options: FindOneOptions<Group>
  ): Promise<Pageable<Group>> {
    if (options) {
      let where: any = options.where;
      if (where.q) {
        const q = where.q;
        delete where.q;
        where = this.Search(where, ["name", "id"], q);
        options.where = where;
      }
      if (!options?.order) {
        options.order = {
          created_at: "DESC",
          id: "ASC",
        };
      }
    }
    return super.getPageable(pageData, options);
  }
  async getList(options?: FindManyOptions<Group>): Promise<Group[]> {
    if (options) {
      let where: any = options.where;
      if (where.q) {
        const q = where.q;
        delete where.q;
        where = this.Search(where, ["name", "id"], q);
        options.where = where;
      }
      if (!options?.order) {
        options.order = {
          created_at: "DESC",
          id: "ASC",
        };
      }
    }
    return super.getList(options);
  }
  async updateUserGroups() {}
}
