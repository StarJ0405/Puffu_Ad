import { BaseService } from "data-source";
import { Banner } from "models/banner";
import { BannerRepository } from "repositories/banner";
import { inject, injectable } from "tsyringe";
import { FindManyOptions, FindOneOptions } from "typeorm";

@injectable()
export class BannerService extends BaseService<Banner, BannerRepository> {
  constructor(@inject(BannerRepository) bannerRepository: BannerRepository) {
    super(bannerRepository);
  }
  async getPageable(
    pageData: PageData,
    options: FindOneOptions<Banner>
  ): Promise<Pageable<Banner>> {
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
  async getList(options?: FindManyOptions<Banner>): Promise<Banner[]> {
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
