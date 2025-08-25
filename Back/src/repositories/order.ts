import { BaseRepository } from "data-source";
import { Order } from "models/order";
import { inject, injectable } from "tsyringe";
import { EntityManager } from "typeorm";

@injectable()
export class OrderRepository extends BaseRepository<Order> {
  constructor(@inject("dataSource") public readonly manager: EntityManager) {
    super(manager, Order);
  }
}
