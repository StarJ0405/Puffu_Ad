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

type MiniBannerItem = {
  name: string;
  link: string;
  thumbnail: { pc: string; mobile: string };
  index: number;
  metadata: [];
};
type MiniBannerCreate = {
  name: string;
  link: string;
  thumbnail: { pc: string; mobile: string };
};

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

  /* ########################### 미니배너 CRUD ################################### */

  private ensureMiniBannerArray(store: Store): MiniBannerItem[] {
  const md: any = store.metadata ?? {};
  if (!Array.isArray(md.minibanner)) md.minibanner = [];
  md.minibanner = md.minibanner
    .map((it: any, i: number) => ({
      name: String(it?.name ?? ""),
      link: String(it?.link ?? ""),
      thumbnail: {
        pc: String(it?.thumbnail?.pc ?? ""),
        mobile: String(it?.thumbnail?.mobile ?? ""),
      },
      index: Number(it?.index ?? i),
      metadata: [],
    }))
    .sort((a: MiniBannerItem, b: MiniBannerItem) => a.index - b.index)
    .map((it: MiniBannerItem, i: number) => ({ ...it, index: i }));
  store.metadata = { ...(store.metadata ?? {}), minibanner: md.minibanner };
  return md.minibanner as MiniBannerItem[];
}

private assertCreatePayload(p: MiniBannerCreate) {
  if (!p?.name) throw new Error("name is required");
  if (!p?.link) throw new Error("link is required");
  if (!p?.thumbnail?.pc) throw new Error("thumbnail.pc is required");
  if (!p?.thumbnail?.mobile) throw new Error("thumbnail.mobile is required");
}

async getMiniBanners(storeId: string): Promise<MiniBannerItem[]> {
  const store = await this.repository.findOne({ where: { id: storeId } });
  if (!store) throw new Error("Store not found");
  return this.ensureMiniBannerArray(store);
}

async addMiniBanner(storeId: string, payload: MiniBannerCreate): Promise<MiniBannerItem> {
  this.assertCreatePayload(payload);
  const store = await this.repository.findOne({ where: { id: storeId } });
  if (!store) throw new Error("Store not found");

  const list = this.ensureMiniBannerArray(store);
  const item: MiniBannerItem = {
    name: payload.name,
    link: payload.link,
    thumbnail: { pc: payload.thumbnail.pc, mobile: payload.thumbnail.mobile },
    index: list.length,
    metadata: [],
  };
  const next = [...list, item].map((it, i) => ({ ...it, index: i }));
  await this.repository.update({ id: storeId }, { metadata: { ...(store.metadata ?? {}), minibanner: next } });
  return item;
}

async updateMiniBanner(
  storeId: string,
  index: number,
  patch: Partial<MiniBannerItem>
): Promise<MiniBannerItem> {
  const store = await this.repository.findOne({ where: { id: storeId } });
  if (!store) throw new Error("Store not found");

  const list = this.ensureMiniBannerArray(store);
  if (index < 0 || index >= list.length) throw new Error("index out of range");

  const base = list[index];
  const merged: MiniBannerItem = {
    name: patch.name ?? base.name,
    link: patch.link ?? base.link,
    thumbnail: {
      pc: patch.thumbnail?.pc ?? base.thumbnail.pc,
      mobile: patch.thumbnail?.mobile ?? base.thumbnail.mobile,
    },
    index: base.index,
    metadata: [],
  };
  const next = list.map((it, i) => (i === index ? merged : it));
  await this.repository.update({ id: storeId }, { metadata: { ...(store.metadata ?? {}), minibanner: next } });
  return merged;
}

async removeMiniBanner(storeId: string, index: number): Promise<void> {
  const store = await this.repository.findOne({ where: { id: storeId } });
  if (!store) throw new Error("Store not found");

  const list = this.ensureMiniBannerArray(store);
  if (index < 0 || index >= list.length) throw new Error("index out of range");

  list.splice(index, 1);
  const next = list.map((it, i) => ({ ...it, index: i }));
  await this.repository.update({ id: storeId }, { metadata: { ...(store.metadata ?? {}), minibanner: next } });
}

async reorderMiniBanner(storeId: string, fromIndex: number, toIndex: number): Promise<MiniBannerItem[]> {
  const store = await this.repository.findOne({ where: { id: storeId } });
  if (!store) throw new Error("Store not found");

  const list = this.ensureMiniBannerArray(store);
  const n = list.length;
  if (fromIndex < 0 || fromIndex >= n || toIndex < 0 || toIndex >= n) {
    throw new Error("index out of range");
  }
  const next = list.slice();
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  const reindexed = next.map((it, i) => ({ ...it, index: i }));

  await this.repository.update({ id: storeId }, { metadata: { ...(store.metadata ?? {}), minibanner: reindexed } });
  return reindexed;
}

async replaceMiniBanners(storeId: string, items: MiniBannerCreate[]): Promise<MiniBannerItem[]> {
  const store = await this.repository.findOne({ where: { id: storeId } });
  if (!store) throw new Error("Store not found");

  items.forEach(this.assertCreatePayload);
  const next: MiniBannerItem[] = items.map((p, i) => ({
    name: p.name,
    link: p.link,
    thumbnail: { pc: p.thumbnail.pc, mobile: p.thumbnail.mobile },
    index: i,
    metadata: [],
  }));
  await this.repository.update({ id: storeId }, { metadata: { ...(store.metadata ?? {}), minibanner: next } });
  return next;
}
}
