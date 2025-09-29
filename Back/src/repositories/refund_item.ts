import { BaseRepository } from "data-source";
import { RefundItem } from "models/refund_item";
import { inject, injectable } from "tsyringe";
import { EntityManager } from "typeorm";

@injectable()
export class RefundItemRepository extends BaseRepository<RefundItem> {
  constructor(@inject("dataSource") public readonly manager: EntityManager) {
    super(manager, RefundItem);
  }
}
