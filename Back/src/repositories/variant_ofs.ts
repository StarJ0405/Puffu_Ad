import { BaseRepository } from "data-source";
import { VariantOfs } from "models/variant_ofs";
import { inject, injectable } from "tsyringe";
import { EntityManager } from "typeorm";

@injectable()
export class VariantOfsRepository extends BaseRepository<VariantOfs> {
  constructor(@inject("dataSource") public readonly manager: EntityManager) {
    super(manager, VariantOfs);
  }
}