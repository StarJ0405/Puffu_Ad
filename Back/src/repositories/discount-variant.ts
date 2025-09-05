import { BaseRepository } from "data-source";
import { DiscountVaraint } from "models/discount-variant";
import { inject, injectable } from "tsyringe";
import { EntityManager } from "typeorm";

@injectable()
export class DiscountVaraintRepository extends BaseRepository<DiscountVaraint> {
  constructor(@inject("dataSource") public readonly manager: EntityManager) {
    super(manager, DiscountVaraint);
  }
}
