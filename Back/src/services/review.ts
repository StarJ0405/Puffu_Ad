import { BaseService } from "data-source";
import { Review } from "models/review";
import { ReviewRepository } from "repositories/review";
import { inject, injectable } from "tsyringe";
import { FindManyOptions, FindOneOptions } from "typeorm";

@injectable()
export class ReviewService extends BaseService<Review, ReviewRepository> {
  constructor(@inject(ReviewRepository) ReviewRepository: ReviewRepository) {
    super(ReviewRepository);
  }
  async getPageable(
    pageData: PageData,
    options: FindOneOptions<Review>
  ): Promise<Pageable<Review>> {
    if (options) {
      let where: any = options.where;
      if (where.q) {
        const q = where.q;
        delete where.q;
        where = this.Search(where, ["id", "content"], q);
        options.where = where;
      }
      if (!options?.order) {
        options.order = {
          created_at: "DESC",
          id: "ASC",
        };
      }
    }
    const result = await super.getPageable(pageData, options);
    if (options.relations) {
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
        result.content = result.content.map((r: any) => {
          if (r.item?.variant?.product_id) {
            const rp = rps.find(
              (f) => f.product_id === r.item?.variant?.product_id
            );
            if (rp) {
              r.count = rp.count;
              r.avg = rp.avg;
            }
          }
          return r;
        });
      }
    }
    return result;
  }
  async getList(options?: FindManyOptions<Review>): Promise<Review[]> {
    if (options) {
      let where: any = options.where;
      if (where.q) {
        const q = where.q;
        delete where.q;
        where = this.Search(where, ["id", "content"], q);
        options.where = where;
      }
      if (!options?.order) {
        options.order = {
          created_at: "DESC",
          id: "ASC",
        };
      }
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
          if (r.item?.variant?.product_id) {
            const rp = rps.find(
              (f) => f.product_id === r.item?.variant?.product_id
            );
            if (rp) {
              r.count = Number(rp.count);
              r.avg = Number(rp.avg);
            }
          }
          return r;
        });
      }
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
}
