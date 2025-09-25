import { BaseService } from "data-source";
import { Cart } from "models/cart";
import { Order, OrderStatus } from "models/order";
import { AddressRepository } from "repositories/address";
import { CartRepository } from "repositories/cart";
import { LineItemRepository } from "repositories/line_item";
import { OrderRepository } from "repositories/order";
import { ShippingMethodRepository } from "repositories/shipping_method";
import { UserRepository } from "repositories/user";
import { VariantRepository } from "repositories/variant";
import { inject, injectable } from "tsyringe";
import { FindManyOptions, FindOneOptions, ILike } from "typeorm";
import { PointService } from "./point";

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
    @inject(VariantRepository)
    protected variantRepository: VariantRepository
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
  }: {
    user_id: string;
    cart_id: string;
    selected: string[];
    address_id: string;
    shipping_method_id: string;
    message: string;
    payment: any;
    point?: number;
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
      status: OrderStatus.PENDING,
      payment_data: payment,
      point: point || 0,
    });
    await Promise.all(
      (items || []).map(async (item) => {
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

    order = await this.orderRepository.findOne({
      where: {
        id: order.id,
      },
      relations: ["shipping_method", "address", "items.brand"],
    });
    if (point > 0) {
      await this.pointService.usePoint(user_id, point);
    }
    return order;
  }
}
