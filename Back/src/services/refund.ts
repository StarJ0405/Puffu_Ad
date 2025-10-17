import axios from "axios";
import { BaseService } from "data-source";
import { Refund } from "models/refund";
import { LogRepository } from "repositories/log";
import { RefundRepository } from "repositories/refund";
import { RefundItemRepository } from "repositories/refund_item";
import { inject, injectable } from "tsyringe";
import { FindManyOptions, FindOneOptions, FindOptionsWhere, In } from "typeorm";
import { GroupService } from "./group";
import { PointService } from "./point";
import { VariantRepository } from "repositories/variant";

@injectable()
export class RefundService extends BaseService<Refund, RefundRepository> {
  constructor(
    @inject(RefundRepository) refundRepository: RefundRepository,
    @inject(RefundItemRepository)
    protected refundItemRepository: RefundItemRepository,
    @inject(VariantRepository)
    protected variantRepository: VariantRepository,
    @inject(LogRepository)
    protected logRepository: LogRepository,
    @inject(PointService)
    protected pointService: PointService,
    @inject(GroupService)
    protected groupService: GroupService
  ) {
    super(refundRepository);
  }
  async getPageable(
    pageData: PageData,
    options: FindOneOptions<Refund>
  ): Promise<Pageable<Refund>> {
    if (options) {
      if (options.where) {
        let where: any = options.where;
        if (where.q) {
          const q = where.q;
          delete where.q;

          const _keyword = ["id"];

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
                  typeof relation === "string" && relation.includes("order")
              )
            ) {
              _where.push(this.Search({}, ["order.display", "order.id"], q));
              _relations.push("order");
            }
            if (
              relations.some(
                (relation) =>
                  typeof relation === "string" &&
                  relation.includes("items.item")
              )
            ) {
              _where.push(
                this.Search(
                  {},
                  ["items.item.product_title", "items.item.variant_title"],
                  q,
                  true
                )
              );
              _relations.push("items.item");
            }
            if (
              relations.some(
                (relation) =>
                  typeof relation === "string" &&
                  relation.includes("order.user")
              )
            ) {
              _where.push(..._where, this.Search({}, ["order.user.name"], q));
              _relations.push("order.user");
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
  async getList(options?: FindManyOptions<Refund>): Promise<Refund[]> {
    if (options) {
      if (options.where) {
        let where: any = options.where;
        if (where.q) {
          const q = where.q;
          delete where.q;

          const _keyword = ["id"];

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
                  typeof relation === "string" && relation.includes("order")
              )
            ) {
              _where.push(this.Search({}, ["order.display", "order.id"], q));
              _relations.push("order");
            }
            if (
              relations.some(
                (relation) =>
                  typeof relation === "string" &&
                  relation.includes("items.item")
              )
            ) {
              _where.push(
                this.Search(
                  {},
                  ["items.item.product_title", "items.item.variant_title"],
                  q,
                  true
                )
              );
              _relations.push("items.item");
            }
            if (
              relations.some(
                (relation) =>
                  typeof relation === "string" &&
                  relation.includes("order.user")
              )
            ) {
              _where.push(..._where, this.Search({}, ["order.user.name"], q));
              _relations.push("order.user");
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

  async refund(
    refund_id: string,
    data: { value: number; point: number; reason?: string }
  ) {
    const refund = await this.repository.findOne({
      where: { id: refund_id },
      relations: ["order", "items.item"],
    });
    if (!refund) throw new Error("환불 정보가 없습니다.");
    const { value = 0, point = 0, reason = "구매자가 취소를 원함" } = data;
    if (value > 0) {
      // 환불 처리
      if (refund.order?.payment_data) {
        const payment_data = refund.order.payment_data;
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
          const amount = value;
          const response = await nestpayAxios.post(
            `${NESTPAY_BASE_URL}/api/refund`,
            { refund: { trackId, rootTrxId, amount, reason } }
          );
          if (response.data) {
            const data = await response.data;
            await this.repository.update(
              { id: refund.id },
              {
                data,
                completed_at: new Date(),
                value,
                point,
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
                cancelAmount: value,
              }),
            }
          );
          const data = await response.json();
          await this.repository.update(
            { id: refund.id },
            {
              data,
              completed_at: new Date(),
              value,
              point,
            }
          );
        } else {
          await this.repository.update(
            { id: refund.id },
            {
              completed_at: new Date(),
              value,
              point,
            }
          );
        }
      }
    }
    if (point > 0) {
      // 포인트 환급
      await this.pointService.create({
        user_id: refund.order?.user_id,
        point,
      });
      const total = await this.pointService.getTotalPoint(
        refund.order?.user_id || ""
      );
      await this.logRepository.create({
        type: "point",
        name: "상품환불(환급)",
        data: {
          point,
          user_id: refund.order?.user_id,
          total,
        },
      });
      if (value <= 0)
        await this.repository.update(
          { id: refund.id },
          { completed_at: new Date(), point }
        );
    }
    // 등급 재조정
    if (refund.order?.user_id)
      await this.groupService.updateUserGroup(refund.order?.user_id);
    // 재고 복구 (증정은 복구 안됨 로직상 어려움)
    await Promise.all(
      (refund?.items || [])?.map(
        async (item) =>
          await this.variantRepository.update(
            {
              id: item.item?.variant_id,
            },
            {
              stack: () => `stack + ${item.quantity}`,
            }
          )
      )
    );
  }
  async delete(
    where: FindOptionsWhere<Refund> | FindOptionsWhere<Refund>[],
    soft?: boolean
  ): Promise<number> {
    const refunds = await this.repository.findAll({ where });
    await Promise.all(
      refunds.map(
        async (refund) =>
          await this.refundItemRepository.delete({
            refund_id: refund.id,
          })
      )
    );
    return await super.delete(where, soft);
  }
}
