import { BaseRepository } from "data-source";
import { StackItem } from "models/stack_item";
import { inject, injectable } from "tsyringe";
import { EntityManager } from "typeorm";

@injectable()
export class StackItemRepository extends BaseRepository<StackItem> {
  constructor(@inject("dataSource") public readonly manager: EntityManager) {
    super(manager, StackItem);
  }
}
