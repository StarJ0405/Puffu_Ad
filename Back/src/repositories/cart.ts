import { BaseRepository } from "data-source";
import { Cart } from "models/cart";
import { inject, injectable } from "tsyringe";
import { EntityManager } from "typeorm";

@injectable()
export class CartRepository extends BaseRepository<Cart> {
  constructor(@inject("dataSource") public readonly manager: EntityManager) {
    super(manager, Cart);
  }
}
