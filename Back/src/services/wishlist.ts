import { BaseService } from "data-source";
import { Wishlist } from "models/wishlist";
import { WishlistRepository } from "repositories/wishlist";
import { inject, injectable } from "tsyringe";

@injectable()
export class WishlistService extends BaseService<Wishlist, WishlistRepository> {
  constructor(
    @inject(WishlistRepository) wishlistRepository: WishlistRepository
  ) {
    super(wishlistRepository);
  }
}
