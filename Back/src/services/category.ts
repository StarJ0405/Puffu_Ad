import { BaseTreeService } from "data-source";
import { Category } from "models/category";
import { CategoryRepository } from "repositories/category";
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
export class CategoryService extends BaseTreeService<
  Category,
  CategoryRepository
> {
  constructor(
    @inject(CategoryRepository) categoryRepository: CategoryRepository
  ) {
    super(categoryRepository);
  }
  async create(data: DeepPartial<Category>): Promise<Category> {
    if (typeof data.index === "undefined") {
      data.index = await this.getCount({
        where: {
          parent_id: data.parent_id || null,
          store_id: data.store_id,
        },
      } as any);
    } else {
      await this.repository
        .builder("e")
        .update()
        .set({ index: () => `index + 1` } as any)
        .where(
          data.parent_id
            ? `parent_id = '${data.parent_id}'`
            : "parent_id IS NULL"
        )
        .andWhere(`store_id = '${data.store_id}'`)
        .andWhere(`index >= ${data.index}`)
        .execute();
    }
    const _data: any = data;
    if (!_data.parent && _data.parent_id) {
      _data.parent = await this.repository.findOne({
        where: { id: _data.parent_id },
        tree: "ancestors",
      } as any);
    }
    return await this.repository.create(_data);
  }
  async creates(
    data: DeepPartial<Category>,
    amount: number
  ): Promise<Category[]> {
    if (amount <= 0) throw Error("amount must be more than 0");

    if (typeof data.index === "undefined") {
      data.index = await this.getCount({
        where: {
          parent_id: data.parent_id || null,
          store_id: data.store_id,
        },
      } as any);
    } else {
      await this.repository
        .builder("e")
        .update()
        .set({ index: () => `index + ${amount}` } as any)
        .where(
          data.parent_id
            ? `parent_id = '${data.parent_id}'`
            : "parent_id IS NULL"
        )
        .andWhere(`store_id = '${data.store_id}'`)
        .andWhere(`index >= ${data.index}`)
        .execute();
    }
    const _data: any = data;
    if (!_data.parent && _data.parent_id) {
      _data.parent = await this.repository.findOne({
        where: { id: _data.parent_id },
        tree: "ancestors",
      } as any);
    }
    return await this.repository.creates(
      Array.from({ length: amount }).map((_, _index) => ({
        ..._data,
        index: Number(_data.index) + _index,
      }))
    );
  }
  async getPageable(
    pageData: PageData,
    options: FindOneOptions<Category> & TreeOptions
  ): Promise<Pageable<Category>> {
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
  async getList(
    options?: FindManyOptions<Category> & TreeOptions
  ): Promise<Category[]> {
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
    where: FindOptionsWhere<Category> | FindOptionsWhere<Category>[],
    data: QueryDeepPartialEntity<Category>,
    returnEnttiy?: boolean
  ): Promise<UpdateResult<Category>> {
    const _data: any = data;
    if (typeof _data.index === "undefined") {
      // _data.index = await this.getCount({
      //   where: {
      //     parent_id: _data.parent_id || null,
      //     store_id: _data.store_id,
      //   },
      // } as any);
    } else {
      const preEntities = await this.repository.findAll({
        where: where,
        select: ["index", "parent_id", "id"],
      });
      await Promise.all(
        preEntities.map(async (preEntity) => {
          const preindex = preEntity?.index || 0;
          if (
            typeof _data.parent_id === "undefined" ||
            preEntity.parent_id === _data.parent_id
          ) {
            _data.parent_id = preEntity.parent_id;
            if (preindex > _data.index) {
              await this.repository
                .builder("e")
                .update()
                .set({ index: () => `index - 1` } as any)
                .where(
                  _data.parent_id
                    ? `parent_id = '${_data.parent_id}'`
                    : "parent_id IS NULL"
                )
                .andWhere(`store_id = '${_data.store_id}'`)
                .andWhere(`index <= ${_data.index}`)
                .andWhere(`index > ${preindex}`)
                .execute();
            } else if (preindex < _data.index) {
              await this.repository
                .builder("e")
                .update()
                .set({ index: () => `index + 1` } as any)
                .where(
                  _data.parent_id
                    ? `parent_id = '${_data.parent_id}'`
                    : "parent_id IS NULL"
                )
                .andWhere(`store_id = '${_data.store_id}'`)
                .andWhere(`index >= ${_data.index}`)
                .andWhere(`index < ${preindex}`)
                .execute();
            }
          } else {
            await this.repository
              .builder("e")
              .update()
              .set({ index: () => `index - 1` } as any)
              .where(
                preEntity.parent_id
                  ? `parent_id = '${preEntity.parent_id}'`
                  : "parent_id IS NULL"
              )
              .andWhere(`store_id = '${preEntity.store_id}'`)
              .andWhere(`index > ${preEntity.index}`)
              .execute();
            await this.repository
              .builder("e")
              .update()
              .set({ index: () => `index + 1` } as any)
              .where(
                _data.parent_id
                  ? `parent_id = '${_data.parent_id}'`
                  : "parent_id IS NULL"
              )
              .andWhere(`store_id = '${_data.store_id}'`)
              .andWhere(`index >= ${_data.index}`)
              .execute();
            console.log("?");
            await this.repository
              .builder("e")
              .update()
              .set({
                mpath: () =>
                  `replace(mpath,'${preEntity.parent_id}','${_data.parent_id}')`,
              } as any)
              .where(`mpath like '%${preEntity.id}%'`)
              .execute();
          }
        })
      );
    }

    const affected = await this.repository.update(where, _data);
    let result: Category[] = [];
    if (returnEnttiy) {
      result = await this.repository.findAll({ where });
    }
    return {
      affected: affected,
      result,
    };
  }
  async delete(
    where: FindOptionsWhere<Category> | FindOptionsWhere<Category>[],
    soft: boolean = true
  ): Promise<number> {
    const entities = await this.repository.findAll({
      where: where,
    });
    await Promise.all(
      entities.map(async (entity) => {
        if (entity) {
          if (soft) {
            await this.repository
              .builder("e")
              .update()
              .set({
                deleted_at: () => `NOW()`,
              } as any)
              .where(`mpath like '%${entity.id}%'`)
              .andWhere(`id != '${entity.id}'`)
              .execute();
          } else {
            await this.repository
              .builder("e")
              .update()
              .set({ parent_id: () => "null" } as any)
              .where(`mpath like '%${entity.id}%'`)
              .andWhere(`id != '${entity.id}'`)
              .execute();
            await this.repository
              .builder("e")
              .delete()
              .where(`mpath like '%${entity.id}%'`)
              .andWhere(`id != '${entity.id}'`)
              .execute();
          }
          await this.repository
            .builder("e")
            .update()
            .set({ index: () => `index - 1` } as any)
            .where(
              entity.parent_id
                ? `parent_id = '${entity.parent_id}'`
                : "parent_id IS NULL"
            )
            .where(`store_id = '${entity.store_id}'`)
            .andWhere(`index > ${entity.index}`)
            .execute();
        }
      })
    );

    return await this.repository.delete(where, soft);
  }
  async restore(
    where: FindOptionsWhere<Category> | FindOptionsWhere<Category>[],
    returnEnttiy?: boolean
  ): Promise<RestoreResult<Category>> {
    const entities = await this.repository.findAll({
      where: { ...where, deleted_at: Not(IsNull()) },
      withDeleted: true,
    } as any);
    await Promise.all(
      entities.map(async (entity) => {
        await this.repository
          .builder("e")
          .update()
          .set({ index: () => `index + 1` } as any)
          .where(`parent_id = '${entity.parent_id}'`)
          .andWhere(`store_id = '${entity.store_id}'`)
          .andWhere(`index >= ${entity.index}`)
          .andWhere(`id != ${entity.id}`)
          .execute();
      })
    );
    const affected = await this.repository.restore(where);
    let result: Category[] = [];
    if (returnEnttiy) {
      result = await this.repository.findAll({ where });
    }
    return {
      affected: affected,
      result,
    };
  }
}
