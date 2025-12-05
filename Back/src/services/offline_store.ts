import { BaseRepository, BaseService } from "data-source";
import { OfflineStore } from "models/offline_store";
import { OfflineStoreRepository } from "repositories/offline_store";
import { inject, injectable } from "tsyringe";
import { FindManyOptions } from "typeorm";

@injectable()
export class OfflineStoreService extends BaseService<
  OfflineStore,
  OfflineStoreRepository
> {
  constructor(
    @inject(OfflineStoreRepository)
    offlineStoreRepository: OfflineStoreRepository
  ) {
    super(offlineStoreRepository);
  }

  async getPageable(
    pageData: PageData,
    options: FindManyOptions<OfflineStore>
  ): Promise<Pageable<OfflineStore>> {
    if (options) {
      let where: any = options.where;

      if (where && where.q) {
        const q = where.q;
        delete where.q;
        where = this.Search(where, ["name", "address", "kiosk_uuid"], q);

        options.where = where;
      }

      if (!options.order) {
        options.order = {
          created_at: "DESC",
          name: "ASC",
        };
      }
    }

    return super.getPageable(pageData, options);
  }
}
