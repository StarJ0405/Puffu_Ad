import { BaseRepository } from "data-source";
import { EventDiscount } from "models/discount";
import { DiscountProduct } from "models/discount-product";
import { DiscountVaraint } from "models/discount-variant";
import { inject, injectable } from "tsyringe";
import { DeepPartial, EntityManager } from "typeorm";

@injectable()
export class DiscountRepository extends BaseRepository<EventDiscount> {
  constructor(@inject("dataSource") public readonly manager: EntityManager) {
    super(manager, EventDiscount);
  }
  async create(data: DeepPartial<EventDiscount>): Promise<EventDiscount> {
    if (data.products || data.variants) {
      const discount = this.repo.create();
      discount.event_id = data.event_id;
      discount.name = data.name;
      discount.value = data.value || 0;

      discount.products = data.products?.map((product) => {
        const _product = new DiscountProduct();
        _product.product_id = product.product_id;
        return _product;
      });
      discount.variants = data.variants?.map((variant) => {
        const _variant = new DiscountVaraint();
        _variant.variant_id = variant.variant_id;
        return _variant;
      });
      return this.repo.save(discount);
    }
    return super.create(data);
  }
}
