import { BaseService } from "data-source";
import { Brand } from "models/brand";
import { BrandRepository } from "repositories/brand";
import { inject, injectable } from "tsyringe";
import { FindManyOptions, FindOneOptions, FindOptionsWhere } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

@injectable()
export class BrandService extends BaseService<Brand, BrandRepository> {
  constructor(@inject(BrandRepository) brandRepository: BrandRepository) {
    super(brandRepository);
  }
  async getPageable(
    pageData: PageData,
    options: FindOneOptions<Brand>
  ): Promise<Pageable<Brand>> {
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
  async getList(options?: FindManyOptions<Brand>): Promise<Brand[]> {
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
