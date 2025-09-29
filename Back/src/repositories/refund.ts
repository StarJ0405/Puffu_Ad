import { BaseRepository } from "data-source";
import { Refund } from "models/refund";
import { RefundItem } from "models/refund_item";
import { inject, injectable } from "tsyringe";
import { DeepPartial, EntityManager, FindOptionsWhere } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

@injectable()
export class RefundRepository extends BaseRepository<Refund> {
  constructor(@inject("dataSource") public readonly manager: EntityManager) {
    super(manager, Refund);
  }
  async create(data: DeepPartial<Refund>): Promise<Refund> {
    if (data.items) {
      const refund = this.repo.create();
      refund.order_id = data.order_id;
      if (data.value) refund.value = data.value;
      if (data.point) refund.point = data.point;
      refund.completed_at = data.completed_at as any;
      refund.data = data.data;
      refund.metadata = data.metadata;
      const items = data.items.map((item) => {
        const _item = new RefundItem();
        _item.item_id = item.item_id;
        if (item.quantity) _item.quantity = item.quantity;
        item.memo = item.memo;
        item.metadata = item.metadata;
        return _item;
      });
      refund.items = items;
      return this.repo.save(refund);
    }

    return await this.repo.save(this.repo.create(data));
  }
  async creates(data: DeepPartial<Refund>[]): Promise<Refund[]> {
    return await this.repo.save(this.repo.create(data));
  }
  async update(
    where: FindOptionsWhere<Refund> | FindOptionsWhere<Refund>[],
    data: QueryDeepPartialEntity<Refund>
  ): Promise<number> {
    if (data.items) {
      const refund = await this.findOne({ where, relations: ["items"] });
      if (refund) {
        await Promise.all(
          (
            refund?.items?.filter(
              (item) => !(data.items as any[]).some((i) => i?.id === item.id)
            ) || []
          ).map(async (item) => await item.softRemove())
        );

        refund.items = (data.items as any[]).map((item) => {
          let _item = refund?.items?.find((f) => f.id === item?.id);
          if (!_item) {
            _item = new RefundItem();
            _item.refund = refund;
          }
          if (item.id) _item.id = item.id;
          _item.item_id = item.item_id;
          _item.quantity = item.quantity;
          _item.memo = item.memo;
          _item.metadata = item.metadata;
          return _item;
        });

        await this.repo.save(refund);
      }
      return 1;
    }
    const update = await this.repo.update(where, data);
    return update.affected || 0;
  }
}
