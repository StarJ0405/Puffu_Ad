import { BaseService } from "data-source";
import { LineItem } from "models/line_item";
import { LineItemRepository } from "repositories/line_item";
import { inject, injectable } from "tsyringe";
import { FindManyOptions, FindOneOptions } from "typeorm";

@injectable()
export class LineItemService extends BaseService<LineItem, LineItemRepository> {
  constructor(
    @inject(LineItemRepository) lineitemRepository: LineItemRepository
  ) {
    super(lineitemRepository);
  }
  async getPageable(
    pageData: PageData,
    options: FindOneOptions<LineItem>
  ): Promise<Pageable<LineItem>> {
    if (options) {
      if (!options?.order) {
        options.order = {
          created_at: "DESC",
          id: "ASC",
        };
      }
    }
    return super.getPageable(pageData, options);
  }
  async getList(options?: FindManyOptions<LineItem>): Promise<LineItem[]> {
    if (options) {
      if (!options?.order) {
        options.order = {
          created_at: "DESC",
          id: "ASC",
        };
      }
    }
    return super.getList(options);
  }
}
