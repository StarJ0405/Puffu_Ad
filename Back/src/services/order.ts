import axios from "axios";
import { BaseService } from "data-source";
import { Order, OrderStatus } from "models/order";
import { LogRepository } from "repositories/log";
import { OrderRepository } from "repositories/order";
import { ShippingMethodRepository } from "repositories/shipping_method";
import { UserRepository } from "repositories/user";
import { VariantRepository } from "repositories/variant";
import { container, inject, injectable } from "tsyringe";
import { CalcType } from "models/coupon";
import {
  Between,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  In,
  LessThanOrEqual,
  MoreThanOrEqual,
} from "typeorm";
import { PointService } from "./point";
import { CouponService } from "./coupon";

@injectable()
export class OrderService extends BaseService<Order, OrderRepository> {
  constructor(
    @inject(OrderRepository) orderRepository: OrderRepository,
    @inject(ShippingMethodRepository)
    protected shippingMethodRepository: ShippingMethodRepository,
    @inject(UserRepository)
    protected userRepository: UserRepository,
    @inject(PointService)
    protected pointService: PointService,
    @inject(VariantRepository)
    protected variantRepository: VariantRepository
  ) {
    super(orderRepository);
  }
  async getPageable(
    pageData: PageData,
    options: FindOneOptions<Order>
  ): Promise<Pageable<Order>> {
    if (options) {
      if (options.where) {
        let where: any = options.where;
        if (where.start_date) {
          if (where.end_date) {
            where.created_at = Between(where.start_date, where.end_date);
          } else {
            where.created_at = MoreThanOrEqual(where.start_date);
          }
        } else if (where.end_date) {
          where.created_at = LessThanOrEqual(where.end_date);
        }
        delete where.start_date;
        delete where.end_date;
        if (where.q) {
          const q = where.q;
          delete where.q;

          const _keyword = ["display", "id"];

          where = this.Search(where, _keyword, q);

          if (options.relations) {
            const relations = Array.isArray(options.relations)
              ? options.relations
              : [options.relations];
            const _where: any[] = [];
            const _relations: any[] = [];
            if (
              relations.some(
                (relation) =>
                  typeof relation === "string" && relation.includes("items")
              )
            ) {
              _where.push(
                this.Search(
                  {},
                  ["items.product_title", "items.variant_title"],
                  q,
                  true
                )
              );
              _relations.push("items");
            }
            if (
              relations.some(
                (relation) =>
                  typeof relation === "string" && relation.includes("user")
              )
            ) {
              _where.push(..._where, this.Search({}, ["user.name"], q));
              _relations.push("user");
            }

            if (_where.length > 0) {
              const list = await super.getList({
                select: ["id"],
                where: _where,
                relations: _relations,
              });

              where = [
                ...(Array.isArray(where) ? where : [where]),
                { ...options.where, id: In(list.map((order) => order.id)) },
              ];
            }
          }

          options.where = where;
        }
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
  async getList(options?: FindManyOptions<Order>): Promise<Order[]> {
    if (options) {
      if (options.where) {
        let where: any = options.where;
        if (where.start_date) {
          if (where.end_date) {
            where.created_at = Between(where.start_date, where.end_date);
          } else {
            where.created_at = MoreThanOrEqual(where.start_date);
          }
        } else if (where.end_date) {
          where.created_at = LessThanOrEqual(where.end_date);
        }
        delete where.start_date;
        delete where.end_date;
        if (where.q) {
          const q = where.q;
          delete where.q;

          const _keyword = ["display", "id"];

          where = this.Search(where, _keyword, q);

          if (options.relations) {
            const relations = Array.isArray(options.relations)
              ? options.relations
              : [options.relations];
            const _where: any[] = [];
            const _relations: any[] = [];
            if (
              relations.some(
                (relation) =>
                  typeof relation === "string" && relation.includes("items")
              )
            ) {
              _where.push(
                this.Search(
                  {},
                  ["items.product_title", "items.variant_title"],
                  q,
                  true
                )
              );
              _relations.push("items");
            }
            if (
              relations.some(
                (relation) =>
                  typeof relation === "string" && relation.includes("user")
              )
            ) {
              _where.push(..._where, this.Search({}, ["user.name"], q));
              _relations.push("user");
            }

            if (_where.length > 0) {
              const list = await super.getList({
                select: ["id"],
                where: _where,
                relations: _relations,
              });

              where = [
                ...(Array.isArray(where) ? where : [where]),
                { ...options.where, id: In(list.map((order) => order.id)) },
              ];
            }
          }

          options.where = where;
        }
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
  async getStatus(
    user_id: string
  ): Promise<{ status: string; count: number }[]> {
    return await this.repository.query(
      `SELECT status, count(id) FROM public.order WHERE user_id = '${user_id}' GROUP BY status;`
    );
  }
  async updateTrackingNumber(
    where: FindOptionsWhere<Order>,
    tracking_number: string
  ): Promise<void> {
    const order = await this.repository.findOne({
      where,
      relations: ["shipping_method"],
    });
    if (!order) throw new Error("주문서가 없습니다.");
    const method = order?.shipping_method;
    if (!method) throw new Error("배송방법이 없습니다.");
    await this.shippingMethodRepository.update(
      {
        id: method.id,
      },
      {
        tracking_number,
      }
    );
  }
  async cancelOrder(id: string) {
    const order = await this.repository.findOne({
      where: { id },
      relations: [
        "store",
        "items.coupons",
        "coupons",
        "shipping_method.coupons",
      ],
    });
    if (order) {
      await Promise.all(
        (order.items || [])?.map(
          async (item) =>
            await this.variantRepository.update(
              {
                id: item.variant_id,
              },
              {
                stack: () => `stack + ${item.total_quantity}`,
              }
            )
        )
      );
      if (order?.payment_data) {
        // 환불 처리
        const payment_data = order.payment_data;
        if (payment_data.trackId) {
          // NESTPAY
          const NESTPAY_BASE_URL = process.env.NESTPAY_BASE_URL;
          const NESTPAY_SECRET_KEY = process.env.NESTPAY_SECRET_KEY;

          const nestpayAxios = axios.create({
            timeout: 30000,
            maxRedirects: 5,
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: NESTPAY_SECRET_KEY,
            },
          });
          const trackId = payment_data.trackId;
          const rootTrxId = payment_data.trxId;
          const amount = payment_data.amount;
          const reason = "구매자가 취소를 원함";
          const response = await nestpayAxios.post(
            `${NESTPAY_BASE_URL}/api/refund`,
            { refund: { trackId, rootTrxId, amount, reason } }
          );
          if (response.data) {
            const data = await response.data;
            await this.repository.update(
              {
                id: order.id,
              },
              {
                cancel_data: data,
                canceled_at: new Date(),
              }
            );
          }
        } else if (payment_data.type === "BRANDPAY") {
          // TOSS
          const secret = process.env.BRAND_PAY_SECRET_KEY?.trim();
          const auth = "Basic " + Buffer.from(`${secret}:`).toString("base64");
          const response = await fetch(
            `https://api.tosspayments.com/v1/payments/${payment_data.paymentKey}/cancel`,
            {
              method: "POST",
              headers: {
                Authorization: auth,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                cancelReason: "구매자가 취소를 원함",
              }),
            }
          );
          const data = await response.json();
          await this.repository.update(
            {
              id: order.id,
            },
            {
              cancel_data: data,
              canceled_at: new Date(),
            }
          );
        }
      }
      if (order?.point && order?.point > 0) {
        await this.pointService.create({
          user_id: order.user_id,
          point: order.point,
        });
        const total = this.pointService.getTotalPoint(order.user_id || "");
        const repo = container.resolve(LogRepository);
        await repo.create({
          type: "point",
          name: "상품환불(환급)",
          data: {
            point: order.point,
            user_id: order.user_id,
            total,
          },
        });

        // 포인트 환불 처리
        // this.userRepository.update(
        //   {
        //     id: order.user_id,
        //   },
        //   {
        //     metadata: () =>
        //       `metadata || CONCAT('{ "point":"', CAST((CAST(COALESCE(metadata ->>'point','0') as bigint) +${order?.total_discounted}) as TEXT),'"}')::jsonb`,
        //   }
        // );
      }
      const couponService = container.resolve(CouponService);
      if (order.coupons?.length) {
        await couponService.refundCoupon(
          order.coupons.map((coupon) => coupon.id)
        );
        // await Promise.all(
        //   order.coupons.map(
        //     async (coupon) =>
        //       await this.couponRepository.update(
        //         {
        //           id: coupon.id,
        //         },
        //         {
        //           order_id: null,
        //         }
        //       )
        //   )
        // );
      }
      if (order.shipping_method?.coupons?.length) {
        await couponService.refundCoupon(
          order.shipping_method.coupons.map((coupon) => coupon.id)
        );
        // await Promise.all(
        //   order.shipping_method.coupons.map(
        //     async (coupon) =>
        //       await this.couponRepository.update(
        //         {
        //           id: coupon.id,
        //         },
        //         {
        //           shipping_method_id: null,
        //         }
        //       )
        //   )
        // );
      }
      await Promise.all(
        (order.items || [])?.map(
          async (item) =>
            await couponService.refundCoupon(
              (item.coupons || [])?.map((coupon) => coupon.id)
            )
          // await Promise.all(
          //   (item?.coupons || []).map(
          //     async (coupon) =>
          //       await this.couponRepository.update(
          //         {
          //           id: coupon.id,
          //         },
          //         {
          //           item_id: null,
          //         }
          //       )
          //   )
          // )
        )
      );

      await this.repository.update(
        { id: order.id },
        {
          status: OrderStatus.CANCEL,
          canceled_at: new Date(),
        }
      );
    }
  }

  async calcSubscriptionBenefit(orderId: string, byUserId?: string) {
    const order = await this.repository.findOne({
      where: { id: orderId },
      relations: [
        "items.coupons",
        "items.variant",
        "shipping_method.coupons",
        "coupons", // 주문 쿠폰
        "subscribe", // 구독 퍼센트
      ],
    });
    if (!order) throw new Error("ORDER_NOT_FOUND");
    if (byUserId && order.user_id !== byUserId) throw new Error("FORBIDDEN");

    // 아이템 소계(아이템 쿠폰 적용)
    const itemsNet =
      order.items?.reduce((acc, it) => {
        const gross = (it.discount_price || 0) * (it.quantity || 0);
        const red = (it.coupons || []).reduce(
          (s, c) => ({
            pct: s.pct + (c.calc === CalcType.PERCENT ? c.value : 0),
            fix: s.fix + (c.calc === CalcType.FIX ? c.value : 0),
          }),
          { pct: 0, fix: 0 }
        );
        const net = Math.max(
          0,
          Math.round((gross * (100 - red.pct)) / 100.0 - red.fix)
        );
        return acc + net;
      }, 0) || 0;

    // 배송 소계(배송 쿠폰 적용)
    const shipGross = order.shipping_method?.amount || 0;
    const shipRed = (order.shipping_method?.coupons || []).reduce(
      (s, c) => ({
        pct: s.pct + (c.calc === CalcType.PERCENT ? c.value : 0),
        fix: s.fix + (c.calc === CalcType.FIX ? c.value : 0),
      }),
      { pct: 0, fix: 0 }
    );
    const shippingNet = Math.max(
      0,
      Math.round((shipGross * (100 - shipRed.pct)) / 100.0 - shipRed.fix)
    );

    // 주문 쿠폰(참고값)
    const orderRed = (order.coupons || []).reduce(
      (s, c) => ({
        pct: s.pct + (c.calc === CalcType.PERCENT ? c.value : 0),
        fix: s.fix + (c.calc === CalcType.FIX ? c.value : 0),
      }),
      { pct: 0, fix: 0 }
    );

    // 구독 퍼센트 혜택
    const percent = order.subscribe?.percent || 0;
    const base = itemsNet + shippingNet;
    const amount = Math.round((base * percent) / 100.0);

    return {
      order_id: order.id,
      subscribe_id: order.subscribe_id || null,
      base,
      percent,
      amount,
      details: {
        itemsNet,
        shippingNet,
        orderCouponPercent: orderRed.pct,
        orderCouponFix: orderRed.fix,
      },
    };
  }

  async getBenefitSummaryOnDemand(
    subscriptionId: string,
    userId: string,
    from: Date,
    to: Date
  ) {
    const orders = await this.getList({
      where: {
        subscribe_id: subscriptionId,
        user_id: userId,
        status: In([OrderStatus.COMPLETE]),
        created_at: Between(from, to),
      },
      select: ["id"],
    });

    let percentSum = 0;
    for (const o of orders) {
      const r = await this.calcSubscriptionBenefit(o.id, userId);
      percentSum += r.amount || 0;
    }

    const couponService = container.resolve(CouponService);
    const couponSum =
      await couponService.sumSubscriptionCouponUsageBySubscription(
        subscriptionId,
        userId,
        from,
        to
      );

    return {
      percent_benefit: percentSum,
      coupon_benefit: couponSum,
      total: percentSum + couponSum,
    };
  }
}
