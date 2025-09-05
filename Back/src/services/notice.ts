import { BaseService } from "data-source";
import { Notice } from "models/notice";
import { NoticeRepository } from "repositories/notice";
import { inject, injectable } from "tsyringe";
import { FindManyOptions, FindOneOptions } from "typeorm";

@injectable()
export class NoticeService extends BaseService<Notice, NoticeRepository> {
  constructor(@inject(NoticeRepository) noticeRepository: NoticeRepository) {
    super(noticeRepository);
  }
  async getPageable(
    pageData: PageData,
    options: FindOneOptions<Notice>
  ): Promise<Pageable<Notice>> {
    if (options) {
      let where: any = options.where;
      if (where.q) {
        const q = where.q;
        delete where.q;
        where = this.Search(where, ["title", "id"], q);
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
  async getList(options?: FindManyOptions<Notice>): Promise<Notice[]> {
    if (options) {
      let where: any = options.where;
      if (where.q) {
        const q = where.q;
        delete where.q;
        where = this.Search(where, ["title", "id"], q);
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
  async getTypes(store_id: string): Promise<(string | undefined)[]> {
    return (
      await this.repository
        .builder("not")
        .where(`store_id = :store_id`, { store_id })
        .select("type")
        .groupBy("type")
        .getMany()
    ).map((not) => not.type);
  }
}
