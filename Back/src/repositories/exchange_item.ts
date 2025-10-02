import { BaseRepository } from "data-source";
import { ExchangeItem } from "models/exchange_item";
import { inject, injectable } from "tsyringe";
import { EntityManager } from "typeorm";

@injectable()
export class ExchangeItemRepository extends BaseRepository<ExchangeItem> {
  constructor(@inject("dataSource") public readonly manager: EntityManager) {
    super(manager, ExchangeItem);
  }
}
