import { BaseRepository } from "data-source";
import { EventBundle } from "models/bundle";
import { BundleProduct } from "models/bundle-product";
import { BundleVaraint } from "models/bundle-variant";
import { inject, injectable } from "tsyringe";
import { DeepPartial, EntityManager } from "typeorm";

@injectable()
export class BundleRepository extends BaseRepository<EventBundle> {
  constructor(@inject("dataSource") public readonly manager: EntityManager) {
    super(manager, EventBundle);
  }
  async create(data: DeepPartial<EventBundle>): Promise<EventBundle> {
    if (data.variants || data.products) {
      const bundle = this.repo.create();
      bundle.event_id = data.event_id;
      bundle.name = data.name;
      bundle.N = data.N || 1;
      bundle.M = data.M || 0;

      bundle.products = data.products?.map((product) => {
        const _product = new BundleProduct();
        _product.product_id = product.product_id;
        return _product;
      });
      bundle.variants = data.variants?.map((variant) => {
        const _variant = new BundleVaraint();
        _variant.variant_id = variant.variant_id;
        return _variant;
      });
      return this.repo.save(bundle);
    }
    return super.create(data);
  }
}
