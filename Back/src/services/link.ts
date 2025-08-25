import { BaseService } from "data-source";
import { Link } from "models/link";
import { LinkRepository } from "repositories/link";
import { inject, injectable } from "tsyringe";
import { DeepPartial, FindOptionsWhere, In, IsNull } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { generateShortId } from "utils/functions";

@injectable()
export class LinkService extends BaseService<Link, LinkRepository> {
  constructor(@inject(LinkRepository) linkRepository: LinkRepository) {
    super(linkRepository);
  }
  async create(data: DeepPartial<Link>): Promise<Link> {
    let isUnique = false;
    let code = generateShortId(24);
    const type = data.type || IsNull();
    do {
      const entity = await this.repository.findOne({
        where: {
          code,
          type,
        },
      });
      if (!entity) isUnique = true;
      else code = generateShortId(24);
    } while (!isUnique);
    return await this.repository.create({ ...data, code });
  }
  async creates(data: DeepPartial<Link>, amount: number): Promise<Link[]> {
    if (amount <= 0) throw Error("amount must be more than 0");

    let array = Array.from({ length: amount }).map(() => ({
      ...data,
      code: generateShortId(24),
    }));
    let isUnique = false;
    do {
      const type = data.type || IsNull();
      const entities = await this.repository.findAll({
        where: {
          code: In(array.map((link) => link.code)),
          type,
        },
      });
      if (entities.length === 0) isUnique = true;
      else
        array = array.map((link) => {
          if (entities.some((s) => s.code === link.code))
            link.code = generateShortId(24);
          return link;
        });
    } while (!isUnique);

    return await this.repository.creates(array);
  }
  async update(
    where: FindOptionsWhere<Link> | FindOptionsWhere<Link>[],
    data: QueryDeepPartialEntity<Link>,
    returnEnttiy?: boolean
  ): Promise<UpdateResult<Link>> {
    delete data.code;
    delete data.type;
    const affected = await this.repository.update(where, data);
    let result: Link[] = [];
    if (returnEnttiy) {
      result = await this.repository.findAll({ where });
    }
    return {
      affected: affected,
      result,
    };
  }
  async delete(
    where: FindOptionsWhere<Link> | FindOptionsWhere<Link>[],
    soft?: boolean
  ): Promise<number> {
    return await this.repository.delete(where, soft);
  }

  async clean(): Promise<void> {
    await this.repository
      .builder("l")
      .delete()
      .where(`auto_delete is true`)
      .andWhere("((NOW() BETWEEN start_date AND end_date) OR chance = 0)")
      .execute();
  }

  async restore(
    where: FindOptionsWhere<Link> | FindOptionsWhere<Link>[],
    returnEnttiy?: boolean
  ): Promise<RestoreResult<Link>> {
    const affected = await this.repository.restore(where);
    let result: Link[] = [];
    if (returnEnttiy) {
      result = await this.repository.findAll({ where });
    }
    return {
      affected: affected,
      result,
    };
  }
}
