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
    return super.getPageable(pageData, options);
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
    return super.getList(options);
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
