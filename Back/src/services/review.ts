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
}
