import { BaseService } from "data-source";
import { Order, OrderStatus } from "models/order";
import { ShippingType } from "models/shipping_method";
import { OrderRepository } from "repositories/order";
import { ShippingMethodRepository } from "repositories/shipping_method";
import { UserRepository } from "repositories/user";
import { VariantRepository } from "repositories/variant";
import { inject, injectable } from "tsyringe";
import {
  Between,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  In,
  LessThanOrEqual,
  MoreThanOrEqual,
} from "typeorm";

@injectable()
export class OrderService extends BaseService<Order, OrderRepository> {
  constructor(
    @inject(OrderRepository) orderRepository: OrderRepository,
    @inject(ShippingMethodRepository)
    protected shippingMethodRepository: ShippingMethodRepository,
    @inject(UserRepository)
    protected userRepository: UserRepository,
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
      if (!options?.order) {
        options.order = {
          created_at: "DESC",
          id: "ASC",
        };
      }
    }

    return super.getList(options);
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
      }
      if (order?.store?.currency_unit === "P") {
        // 포인트 환불 처리
        this.userRepository.update(
          {
            id: order.user_id,
          },
          {
            metadata: () =>
              `metadata || CONCAT('{ "point":"', CAST((CAST(COALESCE(metadata ->>'point','0') as bigint) +${order?.total_discounted}) as TEXT),'"}')::jsonb`,
          }
        );
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
