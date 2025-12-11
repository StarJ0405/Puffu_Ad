import { BaseService } from "data-source";
import { VariantOfs } from "models/variant_ofs";
import { VariantOfsRepository } from "repositories/variant_ofs";
import { inject, injectable } from "tsyringe";
import { In } from "typeorm";

@injectable()
export class VariantOfsService extends BaseService<
  VariantOfs,
  VariantOfsRepository
> {
  constructor(
    @inject(VariantOfsRepository) repository: VariantOfsRepository
  ) {
    super(repository);
  }

  /**
   * [매핑 정보 조회]
   * 여러 variant_id에 해당하는 오프라인 매핑 정보를 가져옵니다.
   */
  async getMappings(offlineStoreId: string, variantIds: string[]) {
    return await this.repository.findAll({
      where: {
        offline_store_id: offlineStoreId,
        variant_id: In(variantIds),
      },
    });
  }

  /**
   * [재고 동기화]
   * 매장 서버로부터 받은 최신 재고로 업데이트 (단건)
   */
  async updateStack(
    offlineStoreId: string,
    offlineVariantId: string,
    stack: number
  ) {
    await this.repository.update(
      {
        offline_store_id: offlineStoreId,
        offline_variant_id: offlineVariantId,
      },
      { stack }
    );
  }

  /**
   * [재고 차감]
   * 주문 완료 시 캐시 재고 단순 차감
   */
  async decreaseStack(
    offlineStoreId: string,
    variantId: string,
    quantity: number
  ) {
    await this.repository
      .builder("vo")
      .update()
      .set({
        stack: () => `"stack" - ${quantity}`,
      })
      .where("offline_store_id = :storeId", { storeId: offlineStoreId })
      .andWhere("variant_id = :varId", { varId: variantId })
      .execute();
  }
}