import { BaseService } from "data-source";
import { User } from "models/user";
import { UserRepository } from "repositories/user";
import { inject, injectable } from "tsyringe";
import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
} from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { comparePasswords, hashPassword } from "utils/functions";

@injectable()
export class UserService extends BaseService<User, UserRepository> {
  constructor(@inject(UserRepository) userRepository: UserRepository) {
    super(userRepository);
  }

  async getPageable(
    pageData: PageData,
    options: FindOneOptions<User>
  ): Promise<Pageable<User>> {
    if (options) {
      let where: any = options.where;
      if (where?.q) {
        const q = where.q;
        delete where.q;
        where = this.Search(
          where,
          ["username", "id", "phone", "nickname", "name"],
          q
        );
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
  async getList(options?: FindManyOptions<User>): Promise<User[]> {
    if (options) {
      let where: any = options.where;
      if (where?.q) {
        const q = where.q;
        delete where.q;
        where = this.Search(
          where,
          ["username", "id", "phone", "nickname", "name"],
          q
        );
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
  async getByPhone(phone: string): Promise<User | null> {
    const find = await this.repository.findOne({ where: { phone } });
    return find;
  }
  async auth(username: string, password: string): Promise<User | null> {
    const find = await this.repository.findOne({
      where: { username },
      withDeleted: true,
    });

    return find &&
      find.password_hash &&
      (await comparePasswords(password, find.password_hash))
      ? find
      : null;
  }

  async create(data: DeepPartial<User & { password?: string }>): Promise<User> {
    if (data?.password) {
      data.password_hash = await hashPassword(data.password);
      delete data.password;
    }
    return super.create(data as DeepPartial<User>);
  }

  async update(
    where: FindOptionsWhere<User> | FindOptionsWhere<User>[],
    data: QueryDeepPartialEntity<User> & { password?: string },
    returnEnttiy?: boolean
  ): Promise<UpdateResult<User>> {
    if (data?.password) {
      data.password_hash = await hashPassword(data.password);
      delete data.password;
    }
    return super.update(where, data, returnEnttiy);
  }
  async getUser(id: string): Promise<User | null> {
    return await this.repository
      .builder("u")
      .leftJoinAndSelect("u.points", "pt")
      .leftJoinAndSelect("u.accounts", "acc")
      .where(`u.id = :id`, { id })
      .andWhere(
        `(pt is null OR ((pt.ends_at IS NULL OR pt.ends_at > NOW()) AND pt.point - pt.used_point > 0))`
      )
      .getOne();
  }
}
