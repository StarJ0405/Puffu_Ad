import { BaseRepository, BaseService } from "data-source";
import { Order } from "models/order";
import { RecentStore } from "models/recent_store";
import { RecentStoreRepository } from "repositories/recent_store";
import { inject, injectable } from "tsyringe";
@injectable()
export class RecentStoreService extends BaseService<RecentStore, RecentStoreRepository> {
    constructor(@inject(RecentStoreRepository) recentRepository: RecentStoreRepository) {
        super(recentRepository);
    }

    async createOrder(order: Order) {
        const userId = order.user_id;
        const storeId = order.offline_store_id;

        if (!userId || !storeId) {
            return;
        }
        const recent = await this.repository.create({
            user_id: userId,
            offline_store_id: storeId,
            metadata: {
                order_id: order.id,
                ordered_at: order.created_at,
            },
        })
        await this.repository.save(recent)
    }
}