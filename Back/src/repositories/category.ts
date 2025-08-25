import { BaseTreeRepository } from "data-source";
import { Category } from "models/category";
import { inject, injectable } from "tsyringe";
import { EntityManager } from "typeorm";

@injectable()
export class CategoryRepository extends BaseTreeRepository<Category> {
  constructor(@inject("dataSource") public readonly manager: EntityManager) {
    super(manager, Category);
  }
}
