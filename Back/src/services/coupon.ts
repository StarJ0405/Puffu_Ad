import { BaseService } from "data-source";
import _ from "lodash";
import { Condition, Coupon, Target } from "models/coupon";
import { Order, OrderStatus } from "models/order";
import { CouponRepository } from "repositories/coupon";
import { OrderRepository } from "repositories/order";
import { ReviewRepository } from "repositories/review";
import { UserRepository } from "repositories/user";
import { inject, injectable } from "tsyringe";
import {
  Brackets,
  DeepPartial,
  Equal,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  In,
  IsNull,
  LessThanOrEqual,
  MoreThan,
  Or,
  Raw,
} from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { generateShortId } from "utils/functions";

@injectable()
export class CouponService extends BaseService<Coupon, CouponRepository> {
  constructor(
    @inject(CouponRepository) couponRepository: CouponRepository,
    @inject(ReviewRepository) protected reviewRepository: ReviewRepository,
    @inject(OrderRepository) protected orderRepository: OrderRepository,
    @inject(UserRepository) protected userRepository: UserRepository
  ) {
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
      if (where?.q) {
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
    const where: any = options?.where || {};
    let builder = this.repository
      .builder("cu")
      .leftJoinAndSelect("cu.categories", "ct")
      .leftJoinAndSelect("cu.products", "pr")
      .leftJoinAndSelect("pr.discounts", "dis")
      .leftJoinAndSelect("dis.discount", "dd");
    if (where.user_id) {
      builder = builder.andWhere(`cu.user_id = :user_id`, {
        user_id: where.user_id,
      });
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
    if (where.type)
      builder = builder.andWhere(`cu.type = :type`, { type: where.type });

    if (where.used === false) {
      // 사용되지 않은 쿠폰만, 단 기간만료 포함
      builder = builder.andWhere(`
        cu.item_id IS NULL
        AND cu.order_id IS NULL
        AND cu.shipping_method_id IS NULL
      `);
    }

    // 사용됨 OR 기간만료
    if (where.used === true) {
      builder = builder.andWhere(
        `(cu.item_id IS NOT NULL OR cu.order_id IS NOT NULL OR cu.shipping_method_id IS NOT NULL OR (cu.ends_at IS NOT NULL AND cu.ends_at <= NOW()))`
      );
    }
    // 사용만
    if (where._usedOnly === true) {
      builder = builder.andWhere(
        `(cu.item_id IS NOT NULL OR cu.order_id IS NOT NULL OR cu.shipping_method_id IS NOT NULL)`
      );
    }
    // 기간만료만
    // if (where._expired) { // 이거는 사용만료이면서 기간만료인 것도 나옴
    //   builder = builder.andWhere(
    //     "cu.ends_at IS NOT NULL AND cu.ends_at <= NOW()"
    //   );
    // }
    if (where._expired) {
      builder = builder.andWhere(`
        cu.ends_at IS NOT NULL 
        AND cu.ends_at <= NOW()
        AND cu.item_id IS NULL 
        AND cu.order_id IS NULL 
        AND cu.shipping_method_id IS NULL
      `);
    }
    if (!options.order) {
      builder = builder
        .addSelect(
          `CASE
         WHEN cu.item_id IS NULL
          AND cu.order_id IS NULL
          AND cu.shipping_method_id IS NULL
          AND (cu.ends_at IS NULL OR cu.ends_at > NOW())
       THEN 0 ELSE 1 END`,
          "ord"
        )
        .orderBy("ord", "ASC")
        .addOrderBy("cu.ends_at", "ASC")
        .addOrderBy("cu.created_at", "DESC");
    }
    if (pageData) {
      const { pageSize, pageNumber = 0 } = pageData;

      const countBuilder = builder.clone().select("cu.id").distinct(true);

      const NumberOfTotalElements = await countBuilder.getCount();
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
  async updateQuantity(id: string) {
    await this.repository.query(
      `UPDATE public.coupon cuu set quantity = COALESCE((SELECT COUNT(*) FROM public.coupon cu WHERE cu.origin_id = cuu.id AND cu.user_id IS NOT NULL),0);`
    );
  }
  async giveCoupon(
    user_id: string,
    coupons: Coupon | Coupon[],
    options?: { amount?: number; update?: boolean; metadata?: any }
  ) {
    const { amount = 1, update = true, metadata = {} } = options || {};
    coupons = Array.isArray(coupons) ? coupons : [coupons];
    await Promise.all(
      Array.from({ length: amount }).map(
        async () =>
          await Promise.all(
            coupons.map(async (coupon) => {
              const _coupon = new Coupon();
              _coupon.store_id = coupon.store_id;
              _coupon.name = coupon.name;
              _coupon.condition = coupon.condition;
              _coupon.type = coupon.type;
              _coupon.value = coupon.value;
              _coupon.calc = coupon.calc;
              _coupon.min = coupon.min;
              _coupon.appears_at = coupon.appears_at;
              _coupon.date = coupon.date;
              _coupon.range = coupon.range;
              _coupon.date_unit = coupon.date_unit;
              _coupon.target = coupon.target;
              _coupon.group_id = coupon.group_id;
              _coupon.issue_date = coupon.issue_date;
              _coupon.issue_lunar = coupon.issue_lunar;
              _coupon.review_min = coupon.review_min;
              _coupon.review_photo = coupon.review_photo;
              _coupon.max_quantity = coupon.max_quantity;
              _coupon.duplicate = coupon.duplicate;
              _coupon.total_min = coupon.total_min;
              _coupon.total_max = coupon.total_max;
              _coupon.order_starts_at = coupon.order_starts_at;
              _coupon.order_ends_at = coupon.order_ends_at;
              _coupon.buy_type = coupon.buy_type;
              _coupon.buy_min = coupon.buy_min;
              _coupon.code = coupon.code;
              _coupon.interval = coupon.interval;
              _coupon.metadata = _.merge(coupon.metadata || {}, metadata);
              //  실제 적용
              _coupon.user_id = user_id;
              _coupon.origin_id = coupon.id;
              _coupon.products = coupon.products;
              _coupon.categories = coupon.categories;
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
                      ends_at.setMonth(
                        ends_at.getMonth() + (coupon.range || 0)
                      );
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
                      ends_at.setHours(
                        ends_at.getHours() + (coupon.range || 0)
                      );
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
              await this.repository.save(_coupon);
              if (update) await this.updateQuantity(coupon.id);
              return;
            })
          )
      )
    );
    await Promise.all(
      coupons.map(async (coupon) => await this.updateQuantity(coupon.id))
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
  async checkReview(user_id: string) {
    const user = await this.userRepository.findOne({
      where: {
        id: user_id,
      },
      select: ["id", "group_id"],
    });

    const where: FindOptionsWhere<Coupon> = {
      user_id: IsNull(),
      ends_at: Or(IsNull(), MoreThan(new Date())),
      target: Target.CONDTION,
      condition: Condition.REVIEW,
      max_quantity: Raw((max) => `(${max} =0 OR ${max} > quantity)`),
    };
    if (user?.group_id) where.group_id = Or(IsNull(), Equal(user.group_id));
    const coupons = await this.repository.findAll({
      where,
    });
    if (coupons.length === 0) return;
    return await Promise.all(
      coupons.map(async (coupon) => {
        const coupon_count = await this.repository.count({
          where: {
            user_id,
            origin_id: coupon.id,
          },
        });
        if (coupon_count > (coupon?.duplicate || 0)) return;
        let builder = this.reviewRepository
          .builder("rv")
          .where("rv.user_id = :user_id", { user_id })
          .andWhere("rv.deleted_at IS NULL")
          .andWhere("rv.created_at > :date", {
            date: coupon.created_at,
          });
        if (coupon.review_photo)
          builder = builder.andWhere("array_length(rv.images, 1) >= 1");

        const review_count = await builder.groupBy("rv.user_id").getCount();
        if (review_count < (coupon?.review_min || 0)) return;
        await this.giveCoupon(user_id, coupon);
      })
    );
  }
  async givePurchaseCoupon(order: Order) {
    const where = {
      user_id: IsNull(),
      ends_at: Or(IsNull(), MoreThan(new Date())),
      target: Target.CONDTION,
      condition: Condition.PURCHASE,
      order_starts_at: Or(IsNull(), LessThanOrEqual(order.created_at)),
      order_ends_at: Or(IsNull(), MoreThan(order.created_at)),
      group_id: Or(IsNull(), Equal(order.user?.group_id)),
      max_quantity: Raw((max) => `(${max} =0 OR ${max} > quantity)`),
    };
    const groups = _.groupBy(order.items, (item) => item.variant?.product_id);
    const coupons = await this.repository.findAll({
      where: [
        {
          ...where,
          buy_type: "order",
          buy_min: LessThanOrEqual(
            order.items?.reduce((acc, item) => acc + item.quantity, 0) || 0
          ),
        },
        {
          ...where,
          buy_type: "product",
          buy_min: LessThanOrEqual(
            Object.keys(groups).reduce((acc, key) => {
              const items = groups[key];
              return Math.max(
                acc,
                items.reduce((acc, now) => acc + now.quantity, 0) || 0
              );
            }, 0) || 0
          ),
        },
      ],
    });
    if (coupons.length === 0) return;
    return await Promise.all(
      coupons.map(async (coupon) => {
        const coupon_count = await this.repository.count({
          where: { user_id: order.user_id, origin_id: coupon.id },
        });
        if (coupon_count > (coupon.duplicate || 0)) return;
        return this.giveCoupon(order.user_id || "", coupon, {
          metadata: {
            order_id: order.id,
          },
        });
      })
    );
  }
  async giveFirstCoupon(order: Order) {
    const order_count = await this.orderRepository.count({
      where: { user_id: order.user_id, status: OrderStatus.COMPLETE },
    });
    if (order_count === 0) {
      const coupons = await this.repository.findAll({
        where: {
          user_id: IsNull(),
          ends_at: Or(IsNull(), MoreThan(new Date())),
          target: Target.CONDTION,
          condition: Condition.FIRST,
          order_starts_at: Or(IsNull(), LessThanOrEqual(order.created_at)),
          order_ends_at: Or(IsNull(), MoreThan(order.created_at)),
        },
      });
      if (coupons.length === 0) return;
      return await Promise.all(
        coupons.map(
          async (coupon) =>
            await this.giveCoupon(order.user_id || "", coupon, {
              metadata: { order_id: order.id },
            })
        )
      );
    }
  }
  async giveOrderCoupon(order: Order) {
    const coupons = await this.repository.findAll({
      where: {
        user_id: IsNull(),
        ends_at: Or(IsNull(), MoreThan(new Date())),
        target: Target.CONDTION,
        condition: Condition.ORDER,
        total_max: Raw(
          (max) => `(${max} =0 OR ${max} >= ${order.total_discounted})`
        ),
        total_min: Raw(
          (min) => `(${min} =0 OR ${min} <= ${order.total_discounted})`
        ),
        group_id: Or(IsNull(), Equal(order.user?.group_id)),
        max_quantity: Raw((max) => `(${max} =0 OR ${max} > quantity)`),
        order_starts_at: Or(IsNull(), LessThanOrEqual(order.created_at)),
        order_ends_at: Or(IsNull(), MoreThan(order.created_at)),
      },
    });
    if (coupons.length === 0) return;
    return await Promise.all(
      coupons.map(async (coupon) => {
        const coupon_count = await this.repository.count({
          where: { user_id: order.user_id, origin_id: coupon.id },
        });
        if (coupon_count > (coupon.duplicate || 0)) return;
        return this.giveCoupon(order.user_id || "", coupon, {
          metadata: {
            order_id: order.id,
          },
        });
      })
    );
  }
  async giveShippingCoupon(order: Order) {
    const coupons = await this.repository.findAll({
      where: {
        user_id: IsNull(),
        ends_at: Or(IsNull(), MoreThan(new Date())),
        target: Target.CONDTION,
        condition: Condition.DELIVERY,
        total_max: Raw(
          (max) => `(${max} =0 OR ${max} >= ${order.total_discounted})`
        ),
        total_min: Raw(
          (min) => `(${min} =0 OR ${min} <= ${order.total_discounted})`
        ),
        group_id: Or(IsNull(), Equal(order.user?.group_id)),
        max_quantity: Raw((max) => `(${max} =0 OR ${max} > quantity)`),
        order_starts_at: Or(IsNull(), LessThanOrEqual(order.created_at)),
        order_ends_at: Or(IsNull(), MoreThan(order.created_at)),
      },
    });
    if (coupons.length === 0) return;
    return await Promise.all(
      coupons.map(async (coupon) => {
        const coupon_count = await this.repository.count({
          where: { user_id: order.user_id, origin_id: coupon.id },
        });
        if (coupon_count > (coupon.duplicate || 0)) return;
        return this.giveCoupon(order.user_id || "", coupon, {
          metadata: {
            order_id: order.id,
          },
        });
      })
    );
  }
}
