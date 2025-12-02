import { BaseRepository, BaseService } from "data-source";
import { OfflineStore } from "models/offline_store";
import { OfflineStoreRepository } from "repositories/offline_store";
import { inject, injectable } from "tsyringe";
@injectable()
export class OfflineStoreService extends BaseService<OfflineStore, OfflineStoreRepository> {
  constructor(@inject(OfflineStoreRepository) offlineStoreRepository: OfflineStoreRepository) {
    super(offlineStoreRepository);
  }
}