import { BaseService } from "data-source";
import { Coupon } from "models/coupon";
import { CouponRepository } from "repositories/coupon";
import { inject, injectable } from "tsyringe";
import { FindManyOptions, FindOneOptions, In } from "typeorm";

@injectable()
export class CouponService extends BaseService<Coupon, CouponRepository> {
  constructor(@inject(CouponRepository) couponRepository: CouponRepository) {
    super(couponRepository);
  }
  async getPageable(
    pageData: PageData,
    options: FindOneOptions<Coupon>
  ): Promise<Pageable<Coupon>> {
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
  async getList(options?: FindManyOptions<Coupon>): Promise<Coupon[]> {
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
}
