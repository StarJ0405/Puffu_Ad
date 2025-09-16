import { BaseService } from "data-source";
import { Order, OrderStatus } from "models/order";
import { ShippingType } from "models/shipping_method";
import { LogRepository } from "repositories/log";
import { OrderRepository } from "repositories/order";
import { ShippingMethodRepository } from "repositories/shipping_method";
import { UserRepository } from "repositories/user";
import { VariantRepository } from "repositories/variant";
import { container, inject, injectable } from "tsyringe";
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
import axios from "axios";

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
              _where.push(..._where, this.Search({}, ["user.name"], q, true));
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
              _where.push(..._where, this.Search({}, ["user.name"], q, true));
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
        delete where.q;
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
      relations: ["shipping_methods"],
    });
    if (!order) throw new Error("주문서가 없습니다.");
    const method = (order?.shipping_methods || []).filter(
      (f) => f.type === ShippingType.DEFAULT
    );
    if (!method || method?.length !== 1)
      throw new Error("배송방법이 없습니다.");
    await this.shippingMethodRepository.update(
      {
        id: method[0].id,
      },
      {
        tracking_number,
      }
    );
  }
  async cancelOrder(id: string) {
    const order = await this.repository.findOne({
      where: { id },
      relations: ["store", "items"],
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
          // 부분취소시 cancelAmount
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
      if (order?.store?.currency_unit === "P") {
        await this.pointService.create({
          user_id: order.user_id,
          point: order.total_discounted,
        });
        const repo = container.resolve(LogRepository);
        await repo.create({
          type: "point",
          name: "상품환불(환급)",
          data: {
            point: order.total_discounted,
            user_id: order.user_id,
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

      await this.repository.update(
        { id: order.id },
        {
          status: OrderStatus.CANCEL,
        }
      );
    }
  }
}
