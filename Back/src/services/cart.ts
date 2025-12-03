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
import { FindManyOptions, FindOneOptions, ILike, In } from "typeorm";
import { CouponService } from "./coupon";
import { PointService } from "./point";
import { SubscribeService } from "./subscribe";
import { RecentStoreService } from "./recent_store";

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
    protected recentStoreService: RecentStoreService
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
      .where(`id='${item_id}'`)
      .andWhere(`cart_id = '${cart_id}'`)
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
  }): Promise<Order | null> {
    if (
      !user_id ||
      !cart_id ||
      !selected ||
      selected.length === 0 ||
      !address_id
    ) {
      throw new Error("주문서를 생성하기엔 데이터가 부족합니다.");
    }

    const cart = await this.repository.findOne({
      where: {
        id: cart_id,
        user_id,
      },
      relations: [
        "items.variant.product.discounts.discount",
        "items.variant.discounts.discount",
        "store",
      ],
    });
    if (!cart) throw new Error("해당하는 카트가 없습니다.");
    const items = cart.items?.filter((item) => selected.includes(item.id));
    if (items?.length === 0) throw new Error("담겨있는 상품이 없습니다.");
    const address = await this.addressRepository.findOne({
      where: {
        id: address_id,
      },
    });
    if (!address) throw new Error("해당하는 주소가 없습니다.");
    const _address = {
      ...address,
      id: undefined,
      user_id: null,
      message,
    };
    const shipping_method = await this.shippingMethodRepository.findOne({
      where: {
        id: shipping_method_id,
      },
    });
    if (!shipping_method) throw new Error("해당하는 배송방법이 없습니다.");
    const _shipping_method = {
      ...shipping_method,
      id: undefined,
      store_id: null,
      created_at: undefined,
      updated_at: undefined,
    };

    // if (point > 0) {
    //   const has = await this.pointService.getTotalPoint(user_id);
    //   if (has < point) throw new Error("소지하고 있는 포인트가 부족합니다.");
    // }

    const now = new Date();
    let display = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}${String(now.getDate()).padStart(2, "0")}`;
    const count = await this.orderRepository.count({
      where: {
        display: ILike(`${display}%`),
      },
    });
    display += count.toString(36).padStart(5, "0");

    let order: Order | null = await this.orderRepository.create({
      display,
      user_id,
      store_id: cart.store_id,
      address: _address,
      shipping_method: _shipping_method,
      status: payment?.bank_number ? OrderStatus.AWAITING : OrderStatus.PENDING,
      payment_data: payment,
      point: point || 0,
      subscribe_id,
    });
    const subscribe = subscribe_id
      ? await this.subscribeService.get({ where: { id: subscribe_id } })
      : null;
    // const { orders = [], shippings = [], items=[] } = coupons || {};
    const order_coupons = coupons?.orders?.length
      ? await this.couponService.getList({ where: { id: In(coupons.orders) } })
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
            where: {
              id: In(item.coupons),
            },
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
    // line_item 총 지분 금액 계산 : 배송비 - 포인트 - 기타 할인비
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
            currency_unit: cart.store?.currency_unit,
            brand_id: item.variant?.product?.brand_id,
            tax_rate: item.variant?.product?.tax_rate,
            shared_price:
              (shared_total / total) *
              Math.max(
                0,
                ((item.variant?.discount_price || 0) * (100 - percents)) / 100 -
                fix
              ),
          }
        );
        await this.variantRepository.update(
          {
            id: item.variant_id,
          },
          {
            stack: () => `stack - ${item.total_quantity}`,
          }
        );
      })
    );
    await Promise.all(
      order_coupons.map(
        async (coupon) =>
          await this.couponService.update(
            {
              id: coupon.id,
            },
            {
              order_id: order?.id,
            }
          )
      )
    );
    await Promise.all(
      shipping_coupons.map(
        async (coupon) =>
          await this.couponService.update(
            {
              id: coupon.id,
            },
            {
              shipping_method_id: order?.shipping_method?.id,
            }
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
                  {
                    id: coupon.id,
                  },
                  {
                    item_id: item.id,
                  }
                )
            )
          )
      )
    );
    order = await this.orderRepository.findOne({
      where: {
        id: order.id,
      },
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
    if (order?.user_id && (order as any).offline_store_id) {
      await this.recentStoreService.createOrder(order);
    }

    return order;
  }
}
