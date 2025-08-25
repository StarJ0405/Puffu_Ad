import { BaseService } from "data-source";
import { Store } from "models/store";
import { StoreRepository } from "repositories/store";
import { inject, injectable } from "tsyringe";
import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  IsNull,
  Not,
} from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

@injectable()
export class StoreService extends BaseService<Store, StoreRepository> {
  constructor(@inject(StoreRepository) storeRepository: StoreRepository) {
    super(storeRepository);
  }
  async create(data: DeepPartial<Store>): Promise<Store> {
    if (typeof data.index === "undefined") {
      data.index = await this.getCount();
    } else {
      await this.repository
        .builder("s")
        .update()
        .set({ index: () => `index + 1` })
        .where(`index >= ${data.index}`)
        .execute();
    }

    return super.create(data);
  }
  async creates(data: DeepPartial<Store>, amount: number): Promise<Store[]> {
    if (typeof data.index === "undefined") {
      data.index = await this.getCount();
    } else {
      await this.repository
        .builder("s")
        .update()
        .set({ index: () => `index + ${amount}` })
        .where(`index >= ${data.index}`)
        .execute();
    }
    return super.creates(data, amount);
  }
  async getPageable(
    pageData: PageData,
    options: FindOneOptions<Store>
  ): Promise<Pageable<Store>> {
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
  async getList(options?: FindManyOptions<Store>): Promise<Store[]> {
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
  async update(
    where: FindOptionsWhere<Store> | FindOptionsWhere<Store>[],
    data: QueryDeepPartialEntity<Store>,
    returnEnttiy?: boolean
  ): Promise<UpdateResult<Store>> {
    const _data: any = data;
    if (typeof _data.index === "undefined") {
      // data.index = await this.getCount();
    } else {
      const preEntities = await this.repository.findAll({
        where,
        select: ["index", "id"],
      });
      await Promise.all(
        preEntities.map(async (preEntity) => {
          const preIndex = preEntity.index || 0;
          if (preIndex < _data.index) {
            await this.repository
              .builder("s")
              .update()
              .set({ index: () => `index - 1` })
              .where(`index >= ${preIndex}`)
              .andWhere(`index < ${_data.index}`)
              .execute();
          } else if (preIndex > _data.index) {
            await this.repository
              .builder("s")
              .update()
              .set({ index: () => `index + 1` })
              .where(`index < ${preIndex}`)
              .andWhere(`index >= ${_data.index}`)
              .execute();
          }
        })
      );
    }
    return super.update(where, _data, returnEnttiy);
  }
  async delete(
    where: FindOptionsWhere<Store> | FindOptionsWhere<Store>[],
    soft: boolean = true
  ): Promise<number> {
    const entities = await this.repository.findAll({
      where: where,
    });
    await Promise.all(
      entities.map(async (entity) => {
        await this.repository
          .builder("s")
          .update()
          .set({ index: () => `index - 1` })
          .where(`index > ${entity.index}`)
          .execute();
      })
    );
    return super.delete(where, soft);
  }
  async restore(
    where: FindOptionsWhere<Store> | FindOptionsWhere<Store>[],
    returnEnttiy?: boolean
  ): Promise<RestoreResult<Store>> {
    const entities = await this.repository.findAll({
      where: { ...where, deleted_at: Not(IsNull()) },
      withDeleted: true,
    });
    await Promise.all(
      entities.map(async (entity) => {
        const count = await this.getCount();
        await this.repository.update({ id: entity.id }, { index: count });
      })
    );
    return super.restore(where, returnEnttiy);
  }
}
