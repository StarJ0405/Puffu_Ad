import { BaseRepository } from "data-source";
import { Page } from "models/page";
import { injectable, inject } from "tsyringe";
import { EntityManager } from "typeorm";

@injectable()
export class PageRepository extends BaseRepository<Page> {
  constructor(@inject("dataSource") public readonly manager: EntityManager) {
    super(manager, Page);
  }
}
