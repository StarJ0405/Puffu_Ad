import { BaseRepository } from "data-source";
import { ShippingMethod } from "models/shipping_method";
import { inject, injectable } from "tsyringe";
import { EntityManager } from "typeorm";

@injectable()
export class ShippingMethodRepository extends BaseRepository<ShippingMethod> {
  constructor(@inject("dataSource") public readonly manager: EntityManager) {
    super(manager, ShippingMethod);
  }
}
