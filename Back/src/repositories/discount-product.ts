import { BaseRepository } from "data-source";
import { DiscountProduct } from "models/discount-product";
import { inject, injectable } from "tsyringe";
import { EntityManager } from "typeorm";

@injectable()
export class DiscountProductRepository extends BaseRepository<DiscountProduct> {
  constructor(@inject("dataSource") public readonly manager: EntityManager) {
    super(manager, DiscountProduct);
  }
}
