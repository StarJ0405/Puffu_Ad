import axios from "axios";
import { BaseService } from "data-source";
import { OrderStatus } from "models/order";
import { Subscribe } from "models/subscribe";
import { SubscribeRepository } from "repositories/subscribe";
import { CouponService } from "services/coupon";
import { OrderService } from "services/order";
import { container, inject, injectable } from "tsyringe";
import {
  Between,
  DeepPartial,
  FindManyOptions,
  In,
  IsNull,
  LessThanOrEqual,
  MoreThan,
} from "typeorm";

@injectable()
export class SubscribeService extends BaseService<Subscribe, SubscribeRepository> {
  constructor(
    @inject(SubscribeRepository) repo: SubscribeRepository,
    @inject(CouponService) private couponService: CouponService
  ) {
    super(repo);
  }

  async getPageable(
    pageData: PageData,
    options: FindManyOptions<Subscribe>
  ): Promise<Pageable<Subscribe>> {
    if (options) {
      const where: any = { ...(options.where ?? {}) };
      if (where.q) {
        const q = where.q;
        delete where.q;
        options.where = this.Search(where, ["name", "id"], q);
      } else options.where = where;
      if (!options.order) options.order = { created_at: "DESC", id: "ASC" };
    }
    return super.getPageable(pageData, options);
  }

  async getList(options?: FindManyOptions<Subscribe>): Promise<Subscribe[]> {
    if (options) {
      const where: any = { ...(options.where ?? {}) };
      if (where.q) {
        const q = where.q;
        delete where.q;
        options.where = this.Search(where, ["name", "id"], q);
      } else options.where = where;
      if (!options.order) options.order = { created_at: "DESC", id: "ASC" };
    }
    return super.getList(options);
  }

  // 활성 구독 최신 1건
  async getLatestActive(
    user_id: string,
    store_id: string,
    now = new Date()
  ): Promise<Subscribe | null> {
    return this.repository.findOne({
      where: {
        user_id,
        store_id,
        canceled_at: IsNull(),
        starts_at: LessThanOrEqual(now),
        ends_at: MoreThan(now),
      },
      order: { ends_at: "DESC" },
    });
  }

  // 사전 재구매 가능 여부(남은 30일 이내)
  canPrepurchase(active: Subscribe, now = new Date()): boolean {
    if (!active?.ends_at) return false;
    const endAt = new Date(active.ends_at);
    return endAt.getTime() - now.getTime() <= 30 * 86400000;
  }

  // 플랜 기반 생성(연장 아님)
  async createFromPlan(
    user_id: string,
    plan: Subscribe,
    starts_at: Date,
    ends_at: Date,
    payment_data: any
  ): Promise<Subscribe> {
    const data: DeepPartial<Subscribe> = {
      store_id: plan.store_id,
      name: plan.name,
      price: plan.price,
      percent: plan.percent,
      value: plan.value,
      user_id,
      starts_at,
      ends_at,
      payment_data,
      repeat: false,
      metadata: plan.metadata || {},
    };
    return super.create(data);
  }

  // 기본 플랜 조회(템플릿)
  async getDefaultPlan(store_id: string, name?: string): Promise<Subscribe | null> {
    const list = await this.getList({
      where: { store_id, user_id: IsNull(), ...(name ? { name } : {}) },
      order: { created_at: "ASC", id: "ASC" },
      take: 1,
    });
    return list[0] || null;
  }

  // 즉시 만료 + 미사용 쿠폰 회수
  async cancelSubscription(id: string, byUserId?: string): Promise<Subscribe | null> {
    const sub = await this.repository.findOne({ where: { id } });
    if (!sub) throw new Error("SUBSCRIPTION_NOT_FOUND");
    // byUserId 체크 필요시 추가

    await this.repository.update({ id }, { ends_at: new Date(), canceled_at: new Date(), repeat: false });
    await this.couponService.revokeUnusedSubscriptionCoupons(id);
    return this.repository.findOne({ where: { id } });
  }

  // 누적액 = baseAmount + 기간 내 구독쿠폰 사용합
  async getAccumulatedAmountWithSubCoupons(
    userId: string,
    from: Date,
    to: Date,
    baseAmount: number
  ): Promise<number> {
    const subCouponUsed = await this.couponService.sumSubscriptionCouponUsage(userId, from, to);
    return baseAmount + subCouponUsed;
  }

  // 결제 환불 처리
  async refund(id: string, user_id: string, refund: number): Promise<void> {
    const subscribe = await this.repository.findOne({ where: { id, user_id } });
    if (!subscribe || !subscribe.payment_data) return;

    const payment_data = subscribe.payment_data;
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
      const amount = refund;
      const reason = "구매자가 취소를 원함";
      const response = await nestpayAxios.post(`${NESTPAY_BASE_URL}/api/refund`, {
        refund: { trackId, rootTrxId, amount, reason },
      });
      if (response.data) {
        const data = await response.data;
        await this.repository.update(
          { id: subscribe.id },
          { cancel_data: data, canceled_at: new Date(), repeat: false }
        );
      }
      return;
    }

    if (payment_data.type === "BRANDPAY") {
      // TOSS
      const secret = process.env.BRAND_PAY_SECRET_KEY?.trim();
      const auth = "Basic " + Buffer.from(`${secret}:`).toString("base64");
      const response = await fetch(
        `https://api.tosspayments.com/v1/payments/${payment_data.paymentKey}/cancel`,
        {
          method: "POST",
          headers: { Authorization: auth, "Content-Type": "application/json" },
          body: JSON.stringify({ cancelReason: "구매자가 취소를 원함", cancelAmount: refund }),
        }
      );
      const data = await response.json();
      await this.repository.update(
        { id: subscribe.id },
        { cancel_data: data, canceled_at: new Date(), repeat: false }
      );
      return;
    }

    // 기타
    await this.repository.update(
      { id: subscribe.id },
      { cancel_data: { refund }, canceled_at: new Date(), repeat: false }
    );
  }

  // 환불 견적(기간 내 혜택 합계 기반)
  async computeRefundQuote(
    id: string,
    userId: string,
    now = new Date()
  ): Promise<{
    subscription_id: string;
    period: { from: Date; to: Date };
    paid: number;
    benefit: number;
    breakdown: { percentSum: number; couponSum: number };
    refund: number;
  }> {
    const sub = await this.repository.findOne({ where: { id, user_id: userId } });
    if (!sub) throw new Error("SUBSCRIPTION_NOT_FOUND");

    const from = new Date(sub.starts_at as any);
    const to = new Date(Math.min(new Date(sub.ends_at as any).getTime(), now.getTime()));

    // 퍼센트 혜택 합계: 해당 구독에 묶인 주문만
    const orderService = container.resolve(OrderService);
    const orders = await orderService.getList({
      where: {
        subscribe_id: id,
        user_id: userId,
        status: In([OrderStatus.COMPLETE]),
        created_at: Between(from, to),
      },
      select: ["id"],
    });

    let percentSum = 0;
    for (const o of orders) {
      const r = await orderService.calcSubscriptionBenefit(o.id, userId);
      percentSum += r.amount || 0;
    }

    // 구독 쿠폰 사용 합계: 해당 구독 id 기준, 사용된 것만
    const couponSum = await this.couponService
      .sumSubscriptionCouponUsageBySubscription(id, userId, from, to);

    const benefit = percentSum + couponSum;

    // 결제금액 결정: 결제데이터.amount 우선, 없으면 plan price
    const paid =
      Number((sub as any)?.payment_data?.amount || 0) > 0
        ? Number((sub as any).payment_data.amount)
        : Number(sub.price || 0);

    const refund = Math.max(0, paid - benefit);

    return {
      subscription_id: id,
      period: { from, to },
      paid,
      benefit,
      breakdown: { percentSum, couponSum },
      refund,
    };
  }
}
