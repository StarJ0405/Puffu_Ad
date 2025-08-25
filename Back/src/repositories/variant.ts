import { BaseRepository } from "data-source";
import { Variant } from "models/variant";
import { inject, injectable } from "tsyringe";
import { EntityManager } from "typeorm";

@injectable()
export class VariantRepository extends BaseRepository<Variant> {
  constructor(@inject("dataSource") public readonly manager: EntityManager) {
    super(manager, Variant);
  }
}
