import { BaseService } from "data-source";
import { Coupon } from "models/coupon";
import { CouponRepository } from "repositories/coupon";
import { inject, injectable } from "tsyringe";
import {
  Brackets,
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  In,
} from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { generateShortId } from "utils/functions";

@injectable()
export class CouponService extends BaseService<Coupon, CouponRepository> {
  constructor(@inject(CouponRepository) couponRepository: CouponRepository) {
    super(couponRepository);
  }
  async create(data: DeepPartial<Coupon>): Promise<Coupon> {
    if (data.code) {
      let isUnique = false;
      let code = generateShortId(6, 18);
      do {
        const exist = await this.repository.exists({
          where: {
            code,
          },
        });
        if (!exist) isUnique = true;
        else code = generateShortId(6, 18);
      } while (!isUnique);

      return await this.repository.create({ ...data, code });
    }
    return await this.repository.create(data);
  }

  async creates(data: DeepPartial<Coupon>, amount: number): Promise<Coupon[]> {
    if (amount <= 0) throw Error("amount must be more than 0");
    if (data.code) {
      let array = Array.from({ length: amount }).map(() => ({
        ...data,
        code: generateShortId(6, 18),
      }));
      let isUnique = false;
      do {
        const entities = await this.repository.findAll({
          where: {
            code: In(array.map((coupon) => coupon.code)),
          },
        });
        if (entities.length === 0) isUnique = true;
        else
          array = array.map((link) => {
            if (entities.some((s) => s.code === link.code))
              link.code = generateShortId(24);
            return link;
          });
      } while (!isUnique);
      return await this.repository.creates(array);
    }
    return super.creates(data, amount);
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
  async getWithOrder(options: FindOneOptions<Coupon>, pageData?: PageData) {
    const where: any = options?.where;
    let builder = this.repository.builder("cu");
    if (where.user_id)
      builder = builder.andWhere(`user_id = :user_id`, {
        user_id: where.user_id,
      });
    if ("used" in where) {
      if (where.used)
        builder = builder.andWhere(
          `(cu.item_id IS NOT NULL OR cu.order_id IS NOT NULL OR cu.shipping_method_id IS NOT NULL OR cu.ends_at <= NOW())`
        );
      else
        builder = builder.andWhere(
          `(cu.item_id IS NULL AND cu.order_id IS NULL AND cu.shipping_method_id IS NULL AND cu.ends_at > NOW())`
        );
    }
    if (where.q) {
      const q = where.q;
      builder = builder.andWhere(
        new Brackets((sub) =>
          sub
            .where(
              `fn_text_to_char_array(cu.name) @> fn_text_to_char_array(:q)`,
              {
                q,
              }
            )
            .orWhere(
              `fn_text_to_char_array(cu.id) @> fn_text_to_char_array(:q)`
            )
        )
      );
    }
    if (!options.order) {
      builder = builder
        .addSelect(
          `CASE WHEN cu.item_id IS NULL AND cu.order_id IS NULL AND cu.shipping_method_id IS NULL AND cu.ends_at > NOW() THEN 0 ELSE 1 END, cu.ends_at`,
          "ord"
        )
        .orderBy("ord", "DESC")
        .addOrderBy("cu.created_at", "DESC");
    }
    if (pageData) {
      const { pageSize, pageNumber = 0 } = pageData;
      const NumberOfTotalElements = await builder.getCount();
      const content = await builder
        .take(pageSize)
        .skip(pageNumber * pageSize)
        .getMany();
      const NumberOfElements = content.length;
      const totalPages =
        pageSize > 0 ? Math.ceil(NumberOfTotalElements / pageSize) : 0;
      const last = pageNumber === totalPages - 1;
      return {
        content,
        pageSize,
        pageNumber,
        NumberOfTotalElements,
        NumberOfElements,
        totalPages,
        last,
      };
    } else {
      return await builder.getMany();
    }
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

  async update(
    where: FindOptionsWhere<Coupon> | FindOptionsWhere<Coupon>[],
    data: QueryDeepPartialEntity<Coupon>,
    returnEnttiy?: boolean
  ): Promise<UpdateResult<Coupon>> {
    delete data.code;
    const affected = await this.repository.update(where, data);
    let result: Coupon[] = [];
    if (returnEnttiy) {
      result = await this.repository.findAll({ where });
    }
    return {
      affected: affected,
      result,
    };
  }
}
