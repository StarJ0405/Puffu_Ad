import { BaseRepository } from "data-source";
import { Banner } from "models/banner";
import { inject, injectable } from "tsyringe";
import { EntityManager } from "typeorm";

@injectable()
export class BannerRepository extends BaseRepository<Banner> {
  constructor(@inject("dataSource") public readonly manager: EntityManager) {
    super(manager, Banner);
  }
}
