import { BaseService } from "data-source";
import { Keywords } from "models/keywords";
import { KeywordsRepository } from "repositories/keywords";
import { inject, injectable } from "tsyringe";
import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  MoreThanOrEqual,
} from "typeorm";

@injectable()
export class KeywordsService extends BaseService<Keywords, KeywordsRepository> {
  constructor(
    @inject(KeywordsRepository) keywordsRepository: KeywordsRepository
  ) {
    super(keywordsRepository);
  }
  async create(data: DeepPartial<Keywords>): Promise<Keywords> {
    const date = new Date();
    date.setMinutes(date.getMinutes() - 5);
    const keyword = await this.repository.findOne({
      where: {
        user_id: data.user_id,
        store_id: data.store_id,
        keyword: data.keyword,
        created_at: MoreThanOrEqual(date),
      },
    });
    if (keyword) {
      return keyword;
    }
    return super.create(data);
  }

  async creates(
    data: DeepPartial<Keywords>,
    amount: number
  ): Promise<Keywords[]> {
    throw new Error("해당 서비스에서 제공하지 않는 기능입니다.");
  }

  async getPageable(
    pageData: PageData,
    options: FindOneOptions<Keywords>
  ): Promise<Pageable<Keywords>> {
    if (options) {
      let where: any = options.where;
      if (where.q) {
        const q = where.q;
        delete where.q;
        where = this.Search(where, ["keyword", "id"], q);
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
  async getList(options?: FindManyOptions<Keywords>): Promise<Keywords[]> {
    if (options) {
      let where: any = options.where;
      if (where.q) {
        const q = where.q;
        delete where.q;
        where = this.Search(where, ["keyword", "id"], q);
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
  async getPopulars(
    pageData: PageData,
    options: {
      store_id: string;
      start_date?: Date | string;
      end_date?: string | Date;
    }
  ) {
    let builder = this.repository
      .builder("key")
      .where("store_id = :store_id", { store_id: options.store_id })
      .select("keyword");
    if (options.start_date) {
      if (options.end_date) {
        builder.where(
          `created_at BETWEEN '${new Date(
            options.start_date
          ).toISOString()}' AND '${new Date(options.end_date).toISOString()}'`
        );
      } else {
        builder.where(
          `created_at >= '${new Date(options.start_date).toISOString()}'`
        );
      }
    } else if (options.end_date) {
      builder.where(
        `created_at < '${new Date(options.end_date).toISOString()}'`
      );
    }
    builder = builder
      .addSelect("COUNT(keyword)", "popular")
      .addSelect("MAX(created_at)", "created_at")
      .groupBy("keyword")
      .orderBy("COUNT(keyword)", "DESC")
      .addOrderBy("MAX(created_at)", "DESC")
      .take(pageData.pageSize);
    if (pageData.pageNumber) {
      builder.skip(pageData.pageNumber * pageData.pageSize);
    }

    return builder.getRawMany();
  }
}
