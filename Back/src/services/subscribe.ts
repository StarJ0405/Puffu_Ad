import axios from "axios";
import { BaseService } from "data-source";
import { Subscribe } from "models/subscribe";
import { SubscribeRepository } from "repositories/subscribe";
import { inject, injectable } from "tsyringe";
import { FindManyOptions, FindOneOptions } from "typeorm";

@injectable()
export class SubscribeService extends BaseService<
  Subscribe,
  SubscribeRepository
> {
  constructor(
    @inject(SubscribeRepository) subscribeRepository: SubscribeRepository
  ) {
    super(subscribeRepository);
  }
  async getPageable(
    pageData: PageData,
    options: FindOneOptions<Subscribe>
  ): Promise<Pageable<Subscribe>> {
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
  async getList(options?: FindManyOptions<Subscribe>): Promise<Subscribe[]> {
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
  async refund(id: string, user_id: string, refund: number): Promise<void> {
    const subscribe = await this.repository.findOne({
      where: { id: id, user_id },
    });
    console.log("subscribe", subscribe);
    if (subscribe) {
      if (subscribe.payment_data) {
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
          const response = await nestpayAxios.post(
            `${NESTPAY_BASE_URL}/api/refund`,
            { refund: { trackId, rootTrxId, amount, reason } }
          );
          if (response.data) {
            const data = await response.data;
            await this.repository.update(
              {
                id: subscribe.id,
              },
              {
                cancel_data: data,
                canceled_at: new Date(),
                repeat: false,
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
                cancelAmount: refund,
              }),
            }
          );
          const data = await response.json();
          await this.repository.update(
            {
              id: subscribe.id,
            },
            {
              cancel_data: data,
              canceled_at: new Date(),
              repeat: false,
            }
          );
        } else
          await this.repository.update(
            {
              id: subscribe.id,
            },
            {
              cancel_data: {
                refund,
              },
              canceled_at: new Date(),
              repeat: false,
            }
          );
      }
    }
  }
}
