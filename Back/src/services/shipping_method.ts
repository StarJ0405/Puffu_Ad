import { BaseService } from "data-source";
import { ShippingMethod } from "models/shipping_method";
import { ShippingMethodRepository } from "repositories/shipping_method";
import { inject, injectable } from "tsyringe";

@injectable()
export class ShippingMethodService extends BaseService<
  ShippingMethod,
  ShippingMethodRepository
> {
  constructor(
    @inject(ShippingMethodRepository)
    shippingmethodRepository: ShippingMethodRepository
  ) {
    super(shippingmethodRepository);
  }
}
