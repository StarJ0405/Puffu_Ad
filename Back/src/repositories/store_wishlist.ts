import { StoreWishlist } from "models/store_wishlist";
import { inject, injectable } from "tsyringe";
import { EntityManager } from "typeorm";
import { BaseRepository } from "data-source";


@injectable()
export class StoreWishlistRepository extends BaseRepository<StoreWishlist> {
  constructor(@inject("dataSource") public readonly manager: EntityManager) {
    super(manager, StoreWishlist);
  }
}