import { BaseService } from "data-source";
import { Banner } from "models/banner";
import { BannerRepository } from "repositories/banner";
import { inject, injectable } from "tsyringe";
import { FindManyOptions, FindOneOptions } from "typeorm";

@injectable()
export class BannerService extends BaseService<Banner, BannerRepository> {
  constructor(@inject(BannerRepository) bannerRepository: BannerRepository) {
    super(bannerRepository);
  }
  async getPageable(
    pageData: PageData,
    options: FindOneOptions<Banner>
  ): Promise<Pageable<Banner>> {
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
          importance: "ASC",
          created_at: "DESC",
          id: "ASC",
        };
      }
    }
    return super.getPageable(pageData, options);
  }
  async getList(options?: FindManyOptions<Banner>): Promise<Banner[]> {
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
          importance: "ASC",
          created_at: "DESC",
          id: "ASC",
        };
      }
    }
    return super.getList(options);
  }

  // 생성: importance 미지정 시 MAX+1
  async create(data: Partial<Banner>): Promise<Banner> {
    if (!data.store_id) throw new Error("store_id is required");

    return this.repository.manager.transaction(async (em) => {
      await em.query("SELECT pg_advisory_xact_lock(hashtext($1))", [
        String(data.store_id),
      ]);

      if (data.importance == null) {
        const { max } = (await em
          .createQueryBuilder(Banner, "b")
          .select("COALESCE(MAX(b.importance), -1)", "max")
          .where("b.store_id = :store_id", { store_id: data.store_id })
          .getRawOne<{ max: number | string | null }>()) ?? { max: -1 };

        const maxNum = Number(max);
        data.importance = maxNum + 1;
      }

      const entity = em.create(Banner, data);
      return await em.save(entity);
    });
  }

  // 삭제: 즉시 압축(뒤 번호 전부 -1)
  async deleteAndPull(store_id: string, banner_id: string): Promise<void> {
    await this.repository.manager.transaction(async (em) => {
      await em.query("SELECT pg_advisory_xact_lock(hashtext($1))", [
        String(store_id),
      ]);

      const target = await em.findOne(Banner, {
        where: { id: banner_id, store_id },
      });
      if (!target) return;

      const deletedImportance = Number(target.importance);

      await em.delete(Banner, { id: banner_id });

      await em
        .createQueryBuilder()
        .update(Banner)
        .set({ importance: () => "importance - 1" })
        .where("store_id = :store_id AND importance > :imp", {
          store_id,
          imp: deletedImportance,
        })
        .execute();
    });
  }

  // 이동: 구간 쉬프트로 충돌 없이 재배치
  async updateImportance(
    store_id: string,
    banner_id: string,
    newImportance: number
  ): Promise<void> {
    await this.repository.manager.transaction(async (em) => {
      await em.query("SELECT pg_advisory_xact_lock(hashtext($1))", [
        String(store_id),
      ]);

      const cur = await em.findOne(Banner, {
        where: { id: banner_id, store_id },
      });
      if (!cur) return;

      const oldImportance = Number(cur.importance);
      const to = Number(newImportance);
      if (to === oldImportance) return;

      if (to > oldImportance) {
        // 아래로: (old, to] -1
        await em
          .createQueryBuilder()
          .update(Banner)
          .set({ importance: () => "importance - 1" })
          .where(
            "store_id = :store_id AND importance > :old AND importance <= :to",
            {
              store_id,
              old: oldImportance,
              to,
            }
          )
          .execute();
      } else {
        // 위로: [to, old) +1
        await em
          .createQueryBuilder()
          .update(Banner)
          .set({ importance: () => "importance + 1" })
          .where(
            "store_id = :store_id AND importance >= :to AND importance < :old",
            {
              store_id,
              old: oldImportance,
              to,
            }
          )
          .execute();
      }

      await em.update(Banner, { id: banner_id }, { importance: to });
    });
  }

  // 선택: 전체 리넘버(0..N) 관리자 액션
  async renumber(store_id: string): Promise<void> {
    await this.repository.manager.transaction(async (em) => {
      await em.query("SELECT pg_advisory_xact_lock(hashtext($1))", [
        String(store_id),
      ]);

      const rows = await em.find(Banner, {
        where: { store_id },
        order: { importance: "ASC", created_at: "DESC", id: "ASC" },
        select: ["id"],
      });

      for (let i = 0; i < rows.length; i++) {
        await em.update(Banner, { id: rows[i].id }, { importance: i });
      }
    });
  }
}
