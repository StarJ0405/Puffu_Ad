import { BaseRepository } from "data-source";
import { EventBundle } from "models/bundle";
import { BundleProduct } from "models/bundle-product";
import { BundleVaraint } from "models/bundle-variant";
import { EventDiscount } from "models/discount";
import { DiscountProduct } from "models/discount-product";
import { DiscountVaraint } from "models/discount-variant";
import { Event } from "models/event";
import { inject, injectable } from "tsyringe";
import { DeepPartial, EntityManager } from "typeorm";

@injectable()
export class EventRepository extends BaseRepository<Event> {
  constructor(@inject("dataSource") public readonly manager: EntityManager) {
    super(manager, Event);
  }
  async create(data: DeepPartial<Event>): Promise<Event> {
    if (data.discounts || data.bundles) {
      const event = this.repo.create();
      event.store_id = data.store_id;
      event.title = data.title;
      event.starts_at = data.starts_at as any;
      event.ends_at = data.ends_at as any;

      event.discounts = data.discounts?.map((discount) => {
        const _discount = new EventDiscount();
        _discount.name = discount.name;
        _discount.value = discount.value || 0;
        _discount.products = discount.products?.map((product) => {
          const _product = new DiscountProduct();
          _product.product_id = product.id;
          return _product;
        });
        _discount.variants = discount.variants?.map((variant) => {
          const _variant = new DiscountVaraint();
          _variant.variant_id = variant.id;
          return _variant;
        });
        return _discount;
      });

      event.bundles = data.bundles?.map((bundle) => {
        const _bundle = new EventBundle();
        _bundle.name = bundle.name;
        _bundle.N = bundle.N || 1;
        _bundle.M = bundle.M || 0;
        _bundle.products = bundle.products?.map((product) => {
          const _product = new BundleProduct();
          _product.product_id = product.id;
          return _product;
        });
        _bundle.variants = bundle.variants?.map((variant) => {
          const _variant = new BundleVaraint();
          _variant.variant_id = variant.id;
          return _variant;
        });
        return _bundle;
      });
      return this.repo.save(event);
    }
    return super.create(data);
  }
}
