import { BaseService } from "data-source";
import { Cart } from "models/cart";
import { CalcType } from "models/coupon";
import { Order, OrderStatus } from "models/order";
import { AddressRepository } from "repositories/address";
import { CartRepository } from "repositories/cart";
import { LineItemRepository } from "repositories/line_item";
import { OrderRepository } from "repositories/order";
import { ShippingMethodRepository } from "repositories/shipping_method";
import { UserRepository } from "repositories/user";
import { VariantRepository } from "repositories/variant";
import { inject, injectable } from "tsyringe";
import { FindManyOptions, FindOneOptions, ILike, In, Raw } from "typeorm";
import { CouponService } from "./coupon";
import { PointService } from "./point";
import { RecentStoreService } from "./recent_store";
import { SubscribeService } from "./subscribe";
import { VariantOfsService } from "./variant_ofs";

@injectable()
export class CartService extends BaseService<Cart, CartRepository> {
  constructor(
    @inject(CartRepository) cartRepository: CartRepository,
    @inject(LineItemRepository)
    protected lineItemRepository: LineItemRepository,
    @inject(AddressRepository) protected addressRepository: AddressRepository,
    @inject(ShippingMethodRepository)
    protected shippingMethodRepository: ShippingMethodRepository,
    @inject(OrderRepository)
    protected orderRepository: OrderRepository,
    @inject(UserRepository)
    protected userRepository: UserRepository,
    @inject(PointService)
    protected pointService: PointService,
    @inject(CouponService)
    protected couponService: CouponService,
    @inject(SubscribeService)
    protected subscribeService: SubscribeService,
    @inject(VariantRepository)
    protected variantRepository: VariantRepository,
    @inject(RecentStoreService)
    protected recentStoreService: RecentStoreService,
    @inject(VariantOfsService)
    protected variantOfsService: VariantOfsService
  ) {
    super(cartRepository);
  }

  async addItem(
    cart_id: string,
    {
      variant_id,
      quantity,
      extra_quantity,
    }: { variant_id: string; quantity: number; extra_quantity: number }
  ) {
    if (quantity === 0 && extra_quantity === 0) return;
    const item = await this.lineItemRepository.findOne({
      where: {
        cart_id,
        variant_id,
      },
    });
    if (item) {
      await this.lineItemRepository.update(
        {
          id: item.id,
        },
        {
          quantity: () => `quantity + ${quantity}`,
          extra_quantity: () => `extra_quantity + ${extra_quantity}`,
        }
      );
    } else {
      await this.lineItemRepository.create({
        cart_id,
        quantity,
        extra_quantity,
        variant_id,
      });
    }
  }

  async updateItem(
    cart_id: string,
    item_id: string,
    { quantity, extra_quantity }: { quantity: number; extra_quantity: number }
  ) {
    await this.lineItemRepository.update(
      {
        id: item_id,
        cart_id,
      },
      {
        quantity,
        extra_quantity,
      }
    );
    await this.lineItemRepository
      .builder("l")
      .delete()
      .where("id = :item_id", { item_id })
      .andWhere("cart_id = :cart_id", { cart_id })
      .andWhere(`(quantity + extra_quantity) < 1`)
      .execute();
  }

  async removeItem(cart_id: string, item_id: string) {
    await this.lineItemRepository.delete({
      cart_id,
      id: item_id,
    });
  }

  async getPageable(
    pageData: PageData,
    options: FindOneOptions<Cart>
  ): Promise<Pageable<Cart>> {
    if (options) {
      if (!options?.order) {
        options.order = {
          created_at: "DESC",
          id: "ASC",
        };
      }
    }
    return super.getPageable(pageData, options);
  }
  async getList(options?: FindManyOptions<Cart>): Promise<Cart[]> {
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

  // 결제 전 재고 확인
  async checkStock(
    offline_store_id: string,
    items: { variant_id: string; quantity: number }[]
  ): Promise<{ buyable: boolean; error?: { code: string; message: string } }> {
    const variantOfsList = await this.variantOfsService.getMappings(
      offline_store_id,
      items.map((i) => i.variant_id)
    );

    if (variantOfsList.length !== items.length) {
      return {
        buyable: false,
        error: {
          code: "101",
          message: "매장에 등록되지 않은 상품이 포함되어 있습니다.",
        },
      };
    }

    try {
      // 외부 통신 (Mockup): 구매 수량을 매장 시스템에 보내고, 재고 여부와 최신 재고를 받음
      const response = {
        data: {
          buyable: true,
          variants: variantOfsList.map((v) => ({
            id: v.offline_variant_id, // 외부 시스템 ID
            stack: 2, // 외부에서 받은 최신 재고 (Mock)
          })),
          error: null,
        },
      };

      const { buyable, variants, error } = response.data;

      // 비동기 재고 최신화 (로컬 DB의 재고를 동기화)
      if (variants) {
        Promise.all(
          variants.map((v) =>
            this.variantOfsService.updateStack(offline_store_id, v.id, v.stack)
          )
        ).catch((err) =>
          console.error("[Sync Error] 로컬 재고 동기화 실패:", err)
        );
      }

      if (!buyable) {
        return {
          buyable: false,
          error: error || {
            code: "STOCK_LACK",
            message: "매장 재고가 부족합니다.",
          },
        };
      }

      return { buyable: true };
    } catch (e) {
      console.error("Store Server Communication Error", e);
      return {
        buyable: false,
        error: {
          code: "500",
          message: "매장 시스템 연결 중 오류가 발생했습니다.",
        },
      };
    }
  }
  // 주문 완료 (단순 차감)
  async complete({
    user_id,
    cart_id,
    selected,
    address_id,
    shipping_method_id,
    message,
    payment,
    point = 0,
    coupons,
    subscribe_id,
    offline_store_id,
  }: {
    user_id: string;
    cart_id: string;
    selected: string[];
    address_id: string;
    shipping_method_id: string;
    message: string;
    payment: any;
    point?: number;
    coupons?: {
      orders?: string[];
      shippings?: string[];
      items?: { item_id: string; coupons: string[] }[];
    };
    subscribe_id?: string;
    offline_store_id?: string;
  }): Promise<Order | null> {
    console.log("complete.offline_store_id >>>", offline_store_id);

    //픽업일 경우 주소 필수 체크 해제
    if (
      !user_id ||
      !cart_id ||
      !selected ||
      selected.length === 0 ||
      (!address_id && !offline_store_id) // 픽업이 아닌데 주소가 없으면 에러
    ) {
      throw new Error("주문서를 생성하기엔 데이터가 부족합니다.");
    }

    let cart: Cart | null = null;

    try {
      cart = await this.repository.findOne({
        where: { id: cart_id, user_id },
        relations: [
          "items.variant.product.discounts.discount",
          "items.variant.discounts.discount",
          "store",
        ],
      });
      if (!cart) throw new Error("해당하는 카트가 없습니다.");
      const items = cart.items?.filter((item) => selected.includes(item.id));
      if (!items || items.length === 0)
        throw new Error("담겨있는 상품이 없습니다.");
      let _address: any = undefined;
      if (address_id) {
        const address = await this.addressRepository.findOne({
          where: { id: address_id },
        });
        if (!address) throw new Error("해당하는 주소가 없습니다.");
        _address = {
          ...address,
          id: undefined,
          user_id: null,
          message,
        };
      }

      const shipping_method = await this.shippingMethodRepository.findOne({
        where: { id: shipping_method_id },
      });
      if (!shipping_method) throw new Error("해당하는 배송방법이 없습니다.");
      const _shipping_method = {
        ...shipping_method,
        id: undefined,
        store_id: null,
        created_at: undefined,
        updated_at: undefined,
        deleted_at: undefined,
        shipped_at: undefined,
        coupons: undefined,
      };
      const now = new Date();
      let display = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(
        2,
        "0"
      )}${String(now.getDate()).padStart(2, "0")}`;
      const count = await this.orderRepository.count({
        where: { display: ILike(`${display}%`) },
      });
      display += count.toString(36).padStart(5, "0");

      let order: Order | null = await this.orderRepository.create({
        display,
        user_id,
        store_id: cart.store_id,
        offline_store_id,
        address: _address,
        shipping_method: _shipping_method,
        status: payment?.bank_number
          ? OrderStatus.AWAITING
          : OrderStatus.PENDING,
        payment_data: Raw((alias) => `CAST(:paymentVal AS jsonb)`, {
          paymentVal: JSON.stringify(payment),
        }) as any,
        point: point || 0,
        subscribe_id,
      });
      const subscribe = subscribe_id
        ? await this.subscribeService.get({ where: { id: subscribe_id } })
        : null;

      const order_coupons = coupons?.orders?.length
        ? await this.couponService.getList({
            where: { id: In(coupons.orders) },
          })
        : [];
      const shipping_coupons = coupons?.shippings?.length
        ? await this.couponService.getList({
            where: { id: In(coupons.shippings) },
          })
        : [];
      const item_coupons = await Promise.all(
        (coupons?.items || [])
          ?.filter((f) => selected.includes(f.item_id))
          ?.map(async (item) => ({
            id: item.item_id,
            coupons: await this.couponService.getList({
              where: { id: In(item.coupons) },
            }),
          }))
      );

      const total =
        items?.reduce((acc, item) => {
          const amount = (item.variant?.discount_price || 0) * item.quantity;
          const coupon = item_coupons.find((f) => f.id === item.id);
          if (coupon) {
            const [percents, fix] = coupon.coupons.reduce(
              (acc, now) => {
                if (now.calc === CalcType.FIX) acc[1] += now.value;
                else if (now.calc === CalcType.PERCENT) acc[0] += now.value;
                return acc;
              },
              [0, 0]
            );
            return (
              acc +
              Math.max(0, Math.round((amount * (100 - percents)) / 100.0 - fix))
            );
          }
          return acc + amount;
        }, 0) || 0;

      const [shipping_percents, shipping_fix] = shipping_coupons.reduce(
        (acc, now) => {
          if (now.calc === CalcType.FIX) acc[1] += now.value;
          else if (now.calc === CalcType.PERCENT) acc[0] += now.value;
          return acc;
        },
        [0, 0]
      );
      const shipping =
        ((_shipping_method?.amount || 0) * (100 - shipping_percents)) / 100.0 -
        shipping_fix;
      const [order_percents, order_fix] = order_coupons.reduce(
        (acc, now) => {
          if (now.calc === CalcType.FIX) acc[1] += now.value;
          else if (now.calc === CalcType.PERCENT) acc[0] += now.value;
          return acc;
        },
        [0, 0]
      );
      const shared_total =
        shipping -
        (point || 0) -
        order_fix -
        Math.round(
          ((total + shipping) * (order_percents + (subscribe?.percent || 0))) /
            100.0
        );

      await Promise.all(
        (items || []).map(async (item) => {
          const coupon = item_coupons.find((f) => f.id === item.id);
          const [percents, fix] = coupon?.coupons.reduce(
            (acc, now) => {
              if (now.calc === CalcType.FIX) acc[1] += now.value;
              else if (now.calc === CalcType.PERCENT) acc[0] += now.value;
              return acc;
            },
            [0, 0]
          ) || [0, 0];
          await this.lineItemRepository.update(
            { id: item.id },
            {
              cart_id: null,
              order_id: order?.id,
              product_title: item.variant?.product?.title,
              variant_title: item.variant?.title,
              description: item.variant?.product?.description,
              thumbnail:
                item.variant?.thumbnail || item.variant?.product?.thumbnail,
              unit_price: item.variant?.price,
              discount_price: item.variant?.discount_price,
              currency_unit: cart!.store?.currency_unit,
              brand_id: item.variant?.product?.brand_id,
              tax_rate: item.variant?.product?.tax_rate,
              shared_price:
                (shared_total / total) *
                Math.max(
                  0,
                  ((item.variant?.discount_price || 0) * (100 - percents)) /
                    100 -
                    fix
                ),
            }
          );
        })
      );

      await Promise.all(
        order_coupons.map(
          async (coupon) =>
            await this.couponService.update(
              { id: coupon.id },
              { order_id: order?.id }
            )
        )
      );
      await Promise.all(
        shipping_coupons.map(
          async (coupon) =>
            await this.couponService.update(
              { id: coupon.id },
              { shipping_method_id: order?.shipping_method?.id }
            )
        )
      );
      await Promise.all(
        item_coupons.map(
          async (item) =>
            await Promise.all(
              item.coupons.map(
                async (coupon) =>
                  await this.couponService.update(
                    { id: coupon.id },
                    { item_id: item.id }
                  )
              )
            )
        )
      );

      order = await this.orderRepository.findOne({
        where: { id: order!.id },
        relations: [
          "shipping_method.coupons",
          "address",
          "items.brand",
          "coupons",
          "items.coupons",
          "subscribe",
        ],
      });

      if (point > 0) {
        await this.pointService.usePoint(user_id, point, {
          display: order?.display,
        });
      }

      // 모든 결제/DB 처리가 성공한 후 최종 재고 차감 (Service 이용)
      await Promise.all(
        items.map(async (item) => {
          const totalQty = (item.quantity || 0) + (item.extra_quantity || 0);

          if (offline_store_id) {
            await this.variantOfsService.decreaseStack(
              offline_store_id,
              item.variant_id!,
              totalQty
            );
          } else {
            // 온라인 재고 차감
            await this.variantRepository.update(
              { id: item.variant_id! },
              { stack: () => `stack - ${totalQty}` }
            );
          }
        })
      );

      if (order?.user_id && order.offline_store_id) {
        await this.recentStoreService.createOrder(order);
      }

      return order;
    } catch (error) {
      throw error;
    }
  }

  async cancelLockNotification(
    cart_id: string,
    offline_store_id: string,
    items: { variant_id: string; quantity: number }[]
  ): Promise<{ success: boolean; message: string }> {
    const itemsToUnlock = items.map((item) => ({
      offline_variant_id: item.variant_id!,
      quantity: item.quantity || 0,
    }));

    try {
      const payload = {
        order_key: cart_id,
        offline_store_id: offline_store_id,
        cancellation_reason: "SOCKET_DISCONNECT",
        items_to_unlock: itemsToUnlock,
      };

      console.log(
        `[Offline Notify Mock] Lock CANCELED request sent (Disconnect): ${JSON.stringify(
          payload
        )}`
      );

      return { success: true, message: "Lock 해제 통신 성공" };
    } catch (e) {
      console.error(
        `[Offline Notify Error] Failed to send cancel notice for ${cart_id}:`,
        e
      );
      return { success: false, message: "매장 시스템과의 통신 실패" };
    }
  }
}
