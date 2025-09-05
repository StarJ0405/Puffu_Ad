import { BaseRepository } from "data-source";
import { BundleProduct } from "models/bundle-product";
import { inject, injectable } from "tsyringe";
import { EntityManager } from "typeorm";

@injectable()
export class BundleProductRepository extends BaseRepository<BundleProduct> {
  constructor(@inject("dataSource") public readonly manager: EntityManager) {
    super(manager, BundleProduct);
  }
}
