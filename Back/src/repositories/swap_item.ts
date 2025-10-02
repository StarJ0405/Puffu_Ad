import { BaseRepository } from "data-source";
import { SwapItem } from "models/swap_item";
import { inject, injectable } from "tsyringe";
import { EntityManager } from "typeorm";

@injectable()
export class SwapItemRepository extends BaseRepository<SwapItem> {
  constructor(@inject("dataSource") public readonly manager: EntityManager) {
    super(manager, SwapItem);
  }
}
