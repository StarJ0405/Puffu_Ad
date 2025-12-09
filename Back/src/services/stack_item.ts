import { BaseService } from "data-source";
import { StackItem } from "models/stack_item";
import { StackItemRepository } from "repositories/stack_item";
import { inject, injectable } from "tsyringe";

@injectable()
export class StackItemService extends BaseService<
  StackItem,
  StackItemRepository
> {
  constructor(
    @inject(StackItemRepository) stackRepository: StackItemRepository
  ) {
    super(stackRepository);
  }

  // 임시 재고 차감 (결제 시도시)
  async increaseTempStack(
    offlineStoreId: string,
    variantId: string,
    quantity: number
  ): Promise<boolean> {
    const result = await this.repository
      .builder("stack_item")
      .update()
      .set({
        temp_stack: () => `"temp_stack" + :quantity`,
      })
      .where("offline_store_id = :ofsId", { ofsId: offlineStoreId })
      .andWhere("variant_id = :variantId", { variantId })
      // 가용 재고가 충분한 경우에만 업데이트를 허용합니다. (원자적 검증)
      .andWhere(`"stack" - "temp_stack" >= :quantity`, { quantity })
      .execute();

    return result.affected === 1;
  }

  // --- 2. 임시 재고 취소 (재고 해제: 결제 실패/타임아웃 시) ---
  async decreaseTempStack(
    offlineStoreId: string,
    variantId: string,
    quantity: number
  ): Promise<void> {
    await this.repository
      .builder("stack_item")
      .update()
      .set({
        temp_stack: () => `"temp_stack" - :quantity`,
      })
      .where("offline_store_id = :ofsId", { ofsId: offlineStoreId })
      .andWhere("variant_id = :variantId", { variantId })
      // temp_stack이 0 미만이 되지 않도록 방지
      .andWhere(`"temp_stack" >= :quantity`, { quantity })
      .execute();
  }

  async clearExpiredTempStacks(seconds: number) {
    await this.repository
      .builder("stack_item")
      .update()
      .set({
        temp_stack: 0, 
      })
      .where("updated_at <= :timeLimit", {
        timeLimit: new Date(Date.now() - seconds * 1000),
      })
      .andWhere("temp_stack > 0") // 임시 재고가 잡혀 있는 항목만 대상
      .execute();
  }

  // 실제 재고 차감 (결제 완료 시)
  async reduceStackOnOrderCompletion(
    offlineStoreId: string,
    variantId: string,
    quantity: number
  ): Promise<void> {
    await this.repository
      .builder("stack_item")
      .update()
      .set({
        stack: () => `"stack" - :quantity`, // 실제 재고 감소
        temp_stack: () => `"temp_stack" - :quantity`, // 임시 재고 해제
      })
      .where("offline_store_id = :ofsId", { ofsId: offlineStoreId })
      .andWhere("variant_id = :variantId", { variantId })
      // 실제 재고가 0 미만이 되지 않도록 확인
      .andWhere(`"stack" >= :quantity`, { quantity })
      .execute();
  }
}
