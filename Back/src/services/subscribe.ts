import { BaseService } from "data-source";
import { Subscribe } from "models/subscribe";
import { SubscribeRepository } from "repositories/subscribe";
import { inject, injectable } from "tsyringe";
import { FindManyOptions, FindOneOptions } from "typeorm";

@injectable()
export class SubscribeService extends BaseService<
  Subscribe,
  SubscribeRepository
> {
  constructor(
    @inject(SubscribeRepository) subscribeRepository: SubscribeRepository
  ) {
    super(subscribeRepository);
  }
  async getPageable(
    pageData: PageData,
    options: FindOneOptions<Subscribe>
  ): Promise<Pageable<Subscribe>> {
    if (options) {
      let where: any = options.where;
      if (where.q) {
        const q = where.q;
        delete where.q;
        where = this.Search(where, ["name", "id"], q);
        options.where = where;
      }
      if (!options?.order) {
        options.order = {
          created_at: "DESC",
          id: "ASC",
        };
      }
    }
    return super.getPageable(pageData, options);
  }
  async getList(options?: FindManyOptions<Subscribe>): Promise<Subscribe[]> {
    if (options) {
      let where: any = options.where;
      if (where.q) {
        const q = where.q;
        delete where.q;
        where = this.Search(where, ["name", "id"], q);
        options.where = where;
      }
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
