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

  async getCounts(ids: string[]): Promise<{ id: string; count: number }[]> {
    return await this.repository
      .builder("wh")
      .select("product_id", "id")
      .addSelect("COUNT(*)", "count")
      .where(`product_id IN (${ids.map((id) => `'${id}'`).join(",")})`)
      .groupBy("product_id")
      .getRawMany();
  }
}
