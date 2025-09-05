import { BaseService } from "data-source";
import { QA } from "models/qa";
import { QARepository } from "repositories/qa";
import { inject, injectable } from "tsyringe";
import { FindManyOptions, FindOneOptions } from "typeorm";

@injectable()
export class QAService extends BaseService<QA, QARepository> {
  constructor(@inject(QARepository) qaRepository: QARepository) {
    super(qaRepository);
  }
  async getPageable(
    pageData: PageData,
    options: FindOneOptions<QA>
  ): Promise<Pageable<QA>> {
    if (options) {
      let where: any = options.where;
      if (where.q) {
        const q = where.q;
        delete where.q;
        where = this.Search(where, ["title", "id", "type", "content"], q);
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
  async getList(options?: FindManyOptions<QA>): Promise<QA[]> {
    if (options) {
      let where: any = options.where;
      if (where.q) {
        const q = where.q;
        delete where.q;
        where = this.Search(where, ["title", "id", "type", "content"], q);
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
