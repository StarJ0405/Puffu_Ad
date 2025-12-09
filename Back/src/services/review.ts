import { BaseService } from "data-source";
import { Review } from "models/review";
import { ReviewRepository } from "repositories/review";
import { RecommendService } from "services/recommend";
import { inject, injectable } from "tsyringe";
import { FindManyOptions, FindOneOptions, FindOptionsWhere, In } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

function normalizeWhereKeys(w: any = {}) {
  const out: any = { ...w };
  for (const k of Object.keys(w)) {
    if (k.startsWith("where.")) {
      const nk = k.slice("where.".length);
      out[nk] = w[k];
      delete out[k];
    }
  }
  return out;
}
function hasSpecialLike(w: any) {
  return !!(w?.userNameIlike || w?.productTitleIlike || w?.contentIlike);
}

@injectable()
export class ReviewService extends BaseService<Review, ReviewRepository> {
  constructor(
    @inject(ReviewRepository) ReviewRepository: ReviewRepository,
    @inject(RecommendService)
    private readonly recommendService: RecommendService
  ) {
    super(ReviewRepository);
  }

  async getPageable(
    pageData: PageData,
    options: FindOneOptions<Review>
  ): Promise<Pageable<Review>> {
    if (options) {
      let where: any = options.where ?? {};


      // q 처리(id/content 검색)
      if (where?.q) {
        const q = where.q;
        delete where.q;
        where = this.Search(where, ["id", "content"], q);
      }
      if (where.category_id) {
        const categoryId = String(where.category_id);

        const [row] = await this.repository.query(
          `
            SELECT mpath
            FROM public.category
            WHERE id = $1
            LIMIT 1
          `,
          [categoryId]
        );

        if (!row?.mpath) {
          return {
            content: [],
            pageNumber: Number(pageData.pageNumber ?? 0),
            pageSize: Number(pageData.pageSize ?? 0),
            totalPages: 0,
            last: true,
            NumberOfTotalElements: 0,
            NumberOfElements: 0,
          };
        }

        const rootCategoryId = row.mpath.split('.')[0];
        const rootPrefix = `${rootCategoryId}.%`;

        const rows = await this.repository.query(
          `
           SELECT DISTINCT pc.product_id
           FROM public.product_category pc
           JOIN public.category c ON c.id = pc.category_id
           WHERE c.mpath = $1
           OR c.mpath LIKE $2
          `,
          [rootCategoryId, rootPrefix]
        );

        const productIds = rows.map((r: any) => r.product_id);

        delete where.category_id;

        if (productIds.length === 0) {
          return {
            content: [],
            pageNumber: Number(pageData.pageNumber ?? 0),
            pageSize: Number(pageData.pageSize ?? 0),
            totalPages: 0,
            last: true,
            NumberOfTotalElements: 0,
            NumberOfElements: 0,
          };
        }

        where.item = {
          ...(where.item || {}),
          variant: {
            ...(where.item?.variant || {}),
            product: {
              ...(where.item?.variant?.product || {}),
              id: In(productIds),
            },
          },
        };
      }


      // where.* 키 정규화
      where = normalizeWhereKeys(where);
      options.where = where;

      if (!options.order) {
        options.order = { created_at: "DESC", id: "ASC" };
      }
    }

    const w: any = options?.where ?? {};

    if (hasSpecialLike(w)) {
      const take = Number(pageData.pageSize);
      const pn = Number(pageData.pageNumber ?? 0);
      const skip = pn * take;

      const qb = this.repository
        .builder("r")
        .leftJoinAndSelect("r.user", "u")
        .leftJoinAndSelect("r.item", "li")
        .leftJoinAndSelect("li.variant", "v")
        .leftJoinAndSelect("v.product", "p")
        .orderBy({ "r.created_at": "DESC", "r.id": "ASC" })
        .take(take)
        .skip(skip);

      if (w.userNameIlike) {
        qb.andWhere("u.name ILIKE :uname", { uname: String(w.userNameIlike) });
      }
      if (w.productTitleIlike) {
        qb.andWhere("p.title ILIKE :ptitle", {
          ptitle: String(w.productTitleIlike),
        });
      }
      if (w.contentIlike)
        qb.andWhere("r.content ILIKE :content", {
          content: String(w.contentIlike),
        });
      const [entities, total] = await qb.getManyAndCount();

      if (options?.relations) {
        const relations = Array.isArray(options.relations)
          ? options.relations
          : [options.relations];
        if (
          relations.some(
            (r) => typeof r === "string" && r.includes("item.variant")
          )
        ) {
          const rps = await this.repository
            .builder("r")
            .innerJoin("r.item", "l")
            .innerJoin("l.variant", "v")
            .select("COUNT(*)", "count")
            .addSelect("v.product_id", "product_id")
            .addSelect("AVG(r.star_rate)", "avg")
            .groupBy("v.product_id")
            .getRawMany();

          for (const r of entities as any[]) {
            const pid = r?.item?.variant?.product_id;
            if (pid) {
              const rp = rps.find((f: any) => f.product_id === pid);
              if (rp) {
                r.count = Number(rp.count);
                r.avg = Number(rp.avg);
              }
            }
          }
        }
      }
      const ids = entities.map((e) => e.id).filter(Boolean);
      if (ids.length) {
        const counts = await this.recommendService.getCounts(ids);
        const map = new Map<string, number>(
          counts.map((c) => [String(c.id), Number(c.count) || 0])
        );
        for (const r of entities as any[]) {
          r.recommend_count = map.get(String(r.id)) ?? 0;
        }
      }

      const totalPages = Math.ceil(total / (pageData.pageSize || 1));
      const last = pn + 1 >= Math.max(totalPages, 1);

      return {
        content: entities,
        pageNumber: pn,
        pageSize: pageData.pageSize,
        totalPages,
        last,
        NumberOfTotalElements: total,
        NumberOfElements: entities.length,
      } as Pageable<Review>;
    }

    const result = await super.getPageable(pageData, options);
    if (options?.relations) {
      const relations = Array.isArray(options.relations)
        ? options.relations
        : [options.relations];
      if (
        relations.some(
          (r) => typeof r === "string" && r.includes("item.variant")
        )
      ) {
        const rps = await this.repository
          .builder("r")
          .innerJoin("r.item", "l")
          .innerJoin("l.variant", "v")
          .select("COUNT(*)", "count")
          .addSelect("v.product_id", "product_id")
          .addSelect("AVG(r.star_rate)", "avg")
          .groupBy("v.product_id")
          .getRawMany();

        result.content = (result.content ?? []).map((r: any) => {
          const pid = r?.item?.variant?.product_id;
          if (pid) {
            const rp = rps.find((f: any) => f.product_id === pid);
            if (rp) {
              r.count = Number(rp.count);
              r.avg = Number(rp.avg);
            }
          }
          return r;
        });
      }
    }

    const ids = (result.content ?? []).map((r: any) => r.id).filter(Boolean);
    if (ids.length) {
      const counts = await this.recommendService.getCounts(ids);
      const map = new Map<string, number>(
        counts.map((c) => [String(c.id), Number(c.count) || 0])
      );
      result.content = (result.content ?? []).map((r: any) => ({
        ...r,
        recommend_count: map.get(String(r.id)) ?? 0,
      }));
    }

    return result;
  }

  async getList(options?: FindManyOptions<Review>): Promise<Review[]> {
    if (options) {
      let where: any = options.where ?? {};

      if (where?.q) {
        const q = where.q;
        delete where.q;
        where = this.Search(where, ["id", "content"], q);
      }

      where = normalizeWhereKeys(where);
      options.where = where;

      if (!options.order) {
        options.order = { created_at: "DESC", id: "ASC" };
      }
    }

    const w: any = options?.where ?? {};

    // 특수 like 존재 시: QueryBuilder 경로
    if (hasSpecialLike(w)) {
      const qb = this.repository
        .builder("r")
        .leftJoinAndSelect("r.user", "u")
        .leftJoinAndSelect("r.item", "li")
        .leftJoinAndSelect("li.variant", "v")
        .leftJoinAndSelect("v.product", "p")
        .orderBy({ "r.created_at": "DESC", "r.id": "ASC" });

      if (w.userNameIlike)
        qb.andWhere("u.name ILIKE :uname", { uname: String(w.userNameIlike) });
      if (w.productTitleIlike)
        qb.andWhere("p.title ILIKE :ptitle", {
          ptitle: String(w.productTitleIlike),
        });
      if (w.contentIlike)
        qb.andWhere("r.content ILIKE :content", {
          content: String(w.contentIlike),
        });
      let content = await qb.getMany();

      if (options?.relations) {
        const relations = Array.isArray(options.relations)
          ? options.relations
          : [options.relations];
        if (
          relations.some(
            (r) => typeof r === "string" && r.includes("item.variant")
          )
        ) {
          const rps = await this.repository
            .builder("r")
            .innerJoin("r.item", "l")
            .innerJoin("l.variant", "v")
            .select("COUNT(*)", "count")
            .addSelect("v.product_id", "product_id")
            .addSelect("AVG(r.star_rate)", "avg")
            .groupBy("v.product_id")
            .getRawMany();

          content = content.map((r: any) => {
            const pid = r?.item?.variant?.product_id;
            if (pid) {
              const rp = rps.find((f: any) => f.product_id === pid);
              if (rp) {
                r.count = Number(rp.count);
                r.avg = Number(rp.avg);
              }
            }
            return r;
          });
        }
      }

      const ids = (content ?? []).map((r: any) => r.id).filter(Boolean);
      if (ids.length) {
        const counts = await this.recommendService.getCounts(ids);
        const map = new Map<string, number>(
          counts.map((c) => [String(c.id), Number(c.count) || 0])
        );
        content = (content ?? []).map((r: any) => ({
          ...r,
          recommend_count: map.get(String(r.id)) ?? 0,
        }));
      }

      return content;
    }

    let content = await super.getList(options);

    if (options?.relations) {
      const relations = Array.isArray(options.relations)
        ? options.relations
        : [options.relations];
      if (
        relations.some(
          (r) => typeof r === "string" && r.includes("item.variant")
        )
      ) {
        const rps = await this.repository
          .builder("r")
          .innerJoin("r.item", "l")
          .innerJoin("l.variant", "v")
          .select("COUNT(*)", "count")
          .addSelect("v.product_id", "product_id")
          .addSelect("AVG(r.star_rate)", "avg")
          .groupBy("v.product_id")
          .getRawMany();

        content = content.map((r: any) => {
          const pid = r?.item?.variant?.product_id;
          if (pid) {
            const rp = rps.find((f: any) => f.product_id === pid);
            if (rp) {
              r.count = Number(rp.count);
              r.avg = Number(rp.avg);
            }
          }
          return r;
        });
      }
    }

    const ids = (content ?? []).map((r: any) => r.id).filter(Boolean);
    if (ids.length) {
      const counts = await this.recommendService.getCounts(ids);
      const map = new Map<string, number>(
        counts.map((c) => [String(c.id), Number(c.count) || 0])
      );
      content = (content ?? []).map((r: any) => ({
        ...r,
        recommend_count: map.get(String(r.id)) ?? 0,
      }));
    }

    return content;
  }

  async getProudctData(
    product_id: string
  ): Promise<{ count: number; avg: number }> {
    const result = this.repository
      .builder("r")
      .innerJoin("r.item", "i")
      .innerJoin("i.variant", "v")
      .select("COUNT(DISTINCT r.id)", "count")
      .addSelect("AVG(r.star_rate)", "avg")
      .where("v.product_id = :product_id", { product_id })
      .groupBy("v.product_id")
      .getRawOne();
    return result;
  }

  async getProductStatsByIds(
    productIds: string[]
  ): Promise<{ product_id: string; count: number; avg: number }[]> {
    if (!productIds || productIds.length === 0) return [];

    const rows = await this.repository
      .builder("r")
      .innerJoin("r.item", "i")
      .innerJoin("i.variant", "v")
      .select("v.product_id", "product_id")
      .addSelect("COUNT(DISTINCT r.id)", "count")
      .addSelect("AVG(r.star_rate)", "avg")
      .where("v.product_id IN (:...ids)", { ids: productIds })
      .groupBy("v.product_id")
      .getRawMany();

    return rows.map((row: any) => ({
      product_id: row.product_id,
      count: Number(row.count) || 0,
      avg: Number(row.avg) || 0,
    }));
  }

  async update(
    where: FindOptionsWhere<Review> | FindOptionsWhere<Review>[],
    data: QueryDeepPartialEntity<Review>,
    returnEnttiy?: boolean
  ): Promise<UpdateResult<Review>> {
    if (typeof data.best === "boolean") {
      const reviews = await this.repository.findAll({ where });
      await Promise.all(
        reviews.map(async (review) => {
          if (review.best === data.best) {
            return;
          } else {
            if (data.best) {
              return await this.repository
                .builder("r")
                .update()
                .set({
                  index: () =>
                    `(SELECT COALESCE(MAX(index)+1,0) FROM public.review where best is true)`,
                })
                .where("id = :id", { id: review.id })
                .execute();
            } else {
              data.index = 0;
              return await this.repository
                .builder("r")
                .update()
                .set({ index: () => `index -1` })
                .where(`index > ${review.index}`)
                .execute();
            }
          }
        })
      );
    } else {
      if (typeof data.index === "number" || typeof data.index === "string") {
        const reviews = await this.repository.findAll({ where });
        await Promise.all(
          reviews.map(async (review) => {
            if (review.index === data.index) {
              return;
            } else {
              if (Number(data.index) < Number(review.index)) {
                return await this.repository
                  .builder("r")
                  .update()
                  .set({ index: () => `index + 1` })
                  .where(`index < ${review.index}`)
                  .andWhere(`index >= ${data.index}`)
                  .andWhere("best is true")
                  .execute();
              } else if (Number(data.index) > Number(review.index)) {
                return await this.repository
                  .builder("r")
                  .update()
                  .set({ index: () => `index - 1` })
                  .where(`index > ${review.index}`)
                  .andWhere(`index <= ${data.index}`)
                  .andWhere("best is true")
                  .execute();
              }
            }
          })
        );
      }
    }


    const result = super.update(where, data, returnEnttiy);

    return result;
  }
}
