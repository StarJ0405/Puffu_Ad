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
  async giveCoupon(user_id: string, coupons: Coupon | Coupon[]) {
    coupons = Array.isArray(coupons) ? coupons : [coupons];
    await Promise.all(
      coupons.map(async (coupon) => {
        const _coupon = new Coupon();
        _coupon.name = coupon.name;
        _coupon.store_id = coupon.store_id;
        _coupon.group_id = coupon.group_id;
        _coupon.user_id = user_id;
        _coupon.value = coupon.value;
        _coupon.calc = coupon.calc;
        _coupon.type = coupon.type;
        _coupon.date = coupon.date;
        _coupon.date_unit = coupon.date_unit;
        _coupon.range = coupon.range;
        _coupon.target = coupon.target;
        _coupon.metadata = coupon.metadata;
        // 날짜 계산
        switch (coupon.date) {
          case "fixed": {
            _coupon.starts_at = coupon.starts_at;
            _coupon.ends_at = coupon.ends_at;
            break;
          }
          case "range": {
            const starts_at = new Date();
            const ends_at = new Date();
            switch (coupon.date_unit) {
              case "year": {
                ends_at.setFullYear(
                  ends_at.getFullYear() + (coupon.range || 0)
                );
                _coupon.starts_at = starts_at;
                _coupon.ends_at = ends_at;
                break;
              }
              case "month": {
                ends_at.setMonth(ends_at.getMonth() + (coupon.range || 0));
                _coupon.starts_at = starts_at;
                _coupon.ends_at = ends_at;
                break;
              }
              case "date": {
                ends_at.setDate(ends_at.getDate() + (coupon.range || 0));
                _coupon.starts_at = starts_at;
                _coupon.ends_at = ends_at;
                break;
              }
              case "hours": {
                ends_at.setHours(ends_at.getHours() + (coupon.range || 0));
                _coupon.starts_at = starts_at;
                _coupon.ends_at = ends_at;
                break;
              }
            }
            break;
          }
          case "day": {
            const starts_at = new Date();
            const ends_at = new Date();
            starts_at.setHours(0, 0, 0, 0);
            ends_at.setHours(23, 59, 59, 999);
            _coupon.starts_at = starts_at;
            _coupon.ends_at = ends_at;
            break;
          }
          case "week": {
            const starts_at = new Date();
            starts_at.setHours(0, 0, 0, 0);
            starts_at.setDate(
              starts_at.getDate() -
                (starts_at.getDay() === 0 ? 6 : starts_at.getDay() - 1)
            );
            const ends_at = new Date(starts_at);
            ends_at.setHours(23, 59, 59, 999);
            ends_at.setDate(ends_at.getDate() + 6);
            _coupon.starts_at = starts_at;
            _coupon.ends_at = ends_at;
            break;
          }
          case "month": {
            const starts_at = new Date();
            const ends_at = new Date();
            starts_at.setHours(0, 0, 0, 0);
            starts_at.setDate(1);
            ends_at.setHours(23, 59, 59, 999);
            ends_at.setMonth(ends_at.getMonth() + 1);
            ends_at.setDate(0);
            _coupon.starts_at = starts_at;
            _coupon.ends_at = ends_at;
            break;
          }
          case "year": {
            const starts_at = new Date();
            const ends_at = new Date();
            starts_at.setHours(0, 0, 0, 0);
            starts_at.setMonth(0);
            starts_at.setDate(1);
            ends_at.setHours(23, 59, 59, 999);
            ends_at.setMonth(11);
            ends_at.setDate(31);
            _coupon.starts_at = starts_at;
            _coupon.ends_at = ends_at;
            break;
          }
        }
        return await this.repository.save(_coupon);
      })
    );
  }
}
