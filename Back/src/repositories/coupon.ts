import { BaseRepository } from "data-source";
import { Coupon } from "models/coupon";
import { inject, injectable } from "tsyringe";
import { EntityManager } from "typeorm";

@injectable()
export class CouponRepository extends BaseRepository<Coupon> {
  constructor(@inject("dataSource") public readonly manager: EntityManager) {
    super(manager, Coupon);
  }
}
