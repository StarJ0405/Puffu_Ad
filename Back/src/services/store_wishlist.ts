import { BaseRepository, BaseService } from "data-source";
import { StoreWishlist } from "models/store_wishlist";
import { StoreWishlistRepository } from "repositories/store_wishlist";
import { inject, injectable } from "tsyringe";
@injectable()
export class StoreWishlistService extends BaseService<StoreWishlist, StoreWishlistRepository> {
    constructor(@inject(StoreWishlistRepository) offlineStoreRepository: StoreWishlistRepository) {
        super(offlineStoreRepository);
    }
}