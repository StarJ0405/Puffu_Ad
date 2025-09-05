import { BaseRepository } from "data-source";
import { Wishlist } from "models/wishlist";
import { inject, injectable } from "tsyringe";
import { EntityManager } from "typeorm";

@injectable()
export class WishlistRepository extends BaseRepository<Wishlist> {
  constructor(@inject("dataSource") public readonly manager: EntityManager) {
    super(manager, Wishlist);
  }
}
