import { BaseRepository } from "data-source";
import { BundleVaraint } from "models/bundle-variant";
import { inject, injectable } from "tsyringe";
import { EntityManager } from "typeorm";

@injectable()
export class BundleVaraintRepository extends BaseRepository<BundleVaraint> {
  constructor(@inject("dataSource") public readonly manager: EntityManager) {
    super(manager, BundleVaraint);
  }
}
