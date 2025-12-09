import { BaseRepository, BaseService } from "data-source";
import { Order } from "models/order";
import { RecentStore } from "models/recent_store";
import { RecentStoreRepository } from "repositories/recent_store";
import { inject, injectable } from "tsyringe";
@injectable()
export class RecentStoreService extends BaseService<
  RecentStore,
  RecentStoreRepository
> {
  constructor(
    @inject(RecentStoreRepository) recentRepository: RecentStoreRepository
  ) {
    super(recentRepository);
  }

  async createOrder(order: Order) {
    const userId = order.user_id;
    const storeId = order.offline_store_id;

    if (!userId || !storeId) {
      return;
    }

    // 1. 기존 기록이 있는지 확인 (user_id와 offline_store_id로 유니크하게 검색)
    let recent = await this.repository.findOne({
      where: {
        user_id: userId,
        offline_store_id: storeId,
      },
    });

    const newMetadata = {
      order_id: order.id,
      ordered_at: order.created_at,
    };

    if (recent) {
      // 2. 기록이 이미 있으면 updated_at을 갱신하고 metadata를 업데이트
      recent.metadata = { ...recent.metadata, ...newMetadata };
      recent.updated_at = new Date();
      await this.repository.save(recent);
    } else {
      // 3. 기록이 없으면 새로 생성
      recent = await this.repository.create({
        user_id: userId,
        offline_store_id: storeId,
        metadata: newMetadata,
      });
      await this.repository.save(recent);
    }
  }
}
