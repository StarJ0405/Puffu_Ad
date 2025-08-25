import { BaseRepository } from "data-source";
import { Brand } from "models/brand";
import { inject, injectable } from "tsyringe";
import { EntityManager } from "typeorm";

@injectable()
export class BrandRepository extends BaseRepository<Brand> {
  constructor(@inject("dataSource") public readonly manager: EntityManager) {
    super(manager, Brand);
  }
}
