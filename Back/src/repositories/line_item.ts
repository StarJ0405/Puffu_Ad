import { BaseRepository } from "data-source";
import { LineItem } from "models/line_item";
import { inject, injectable } from "tsyringe";
import { EntityManager } from "typeorm";

@injectable()
export class LineItemRepository extends BaseRepository<LineItem> {
  constructor(@inject("dataSource") public readonly manager: EntityManager) {
    super(manager, LineItem);
  }
}
