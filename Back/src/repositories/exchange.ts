import { BaseRepository } from "data-source";
import { Exchange } from "models/exchange";
import { ExchangeItem } from "models/exchange_item";
import { SwapItem } from "models/swap_item";
import { inject, injectable } from "tsyringe";
import { DeepPartial, EntityManager, FindOptionsWhere } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

@injectable()
export class ExchangeRepository extends BaseRepository<Exchange> {
  constructor(@inject("dataSource") public readonly manager: EntityManager) {
    super(manager, Exchange);
  }
  async create(data: DeepPartial<Exchange>): Promise<Exchange> {
    if (data.items) {
      const exchange = this.repo.create();
      exchange.order_id = data.order_id;
      exchange.completed_at = data.completed_at as any;
      exchange.tracking_number = data.tracking_number;
      exchange.metadata = data.metadata;
      const items = data.items.map((item) => {
        const _item = new ExchangeItem();
        _item.item_id = item.item_id;
        if (item.quantity) _item.quantity = item.quantity;
        item.memo = item.memo;
        item.metadata = item.metadata;
        _item.swaps = item.swaps?.map((swap) => {
          const _swap = new SwapItem();
          _swap.variant_id = swap.variant_id;
          _swap.brand_id = swap.brand_id;
          if (swap.quantity) _swap.quantity = swap.quantity;
          _swap.product_title = swap.product_title;
          _swap.variant_title = swap.variant_title;
          _swap.description = swap.description;
          _swap.thumbnail = swap.thumbnail;
          _swap.unit_price = swap.unit_price;
          _swap.tax_rate = swap.tax_rate;
          _swap.discount_price = swap.discount_price;
          _swap.currency_unit = swap.currency_unit;
          _swap.metadata = swap.metadata;
          return _swap;
        });
        return _item;
      });
      exchange.items = items;
      return this.repo.save(exchange);
    }

    return await this.repo.save(this.repo.create(data));
  }
  async creates(data: DeepPartial<Exchange>[]): Promise<Exchange[]> {
    return await this.repo.save(this.repo.create(data));
  }
  async update(
    where: FindOptionsWhere<Exchange> | FindOptionsWhere<Exchange>[],
    data: QueryDeepPartialEntity<Exchange>
  ): Promise<number> {
    if (data.items) {
      const exchange = await this.findOne({
        where,
        relations: ["items.swaps"],
      });
      if (exchange) {
        await Promise.all(
          (
            exchange?.items?.filter(
              (item) => !(data.items as any[]).some((i) => i?.id === item.id)
            ) || []
          ).map(async (item) => await item.softRemove())
        );

        exchange.tracking_number = data.tracking_number as any;
        exchange.items = await Promise.all(
          (data.items as any[]).map(async (item) => {
            let _item = exchange?.items?.find((f) => f.id === item?.id);
            if (!_item) {
              _item = new ExchangeItem();
              _item.exchange = exchange;
            }
            if (item.id) _item.id = item.id;
            _item.item_id = item.item_id;
            _item.quantity = item.quantity;
            _item.memo = item.memo;
            _item.metadata = item.metadata;

            if (_item.swaps?.length) {
              await Promise.all(
                _item.swaps
                  .filter(
                    (swap) =>
                      !(item.swaps as any[]).some((i) => i?.id === swap.id)
                  )
                  .map(async (swap) => await swap.softRemove())
              );
            }
            _item.swaps = (item.swaps as any[]).map((swap) => {
              let _swap = _item?.swaps?.find((f) => f.id === swap?.id);
              if (!_swap) {
                _swap = new SwapItem();
                _swap.exchange_item = _item;
              }
              if (swap.id) _swap.id = swap.id;
              _swap.variant_id = swap.variant_id;
              _swap.brand_id = swap.brand_id;
              if (swap.quantity) _swap.quantity = swap.quantity;
              _swap.product_title = swap.product_title;
              _swap.variant_title = swap.variant_title;
              _swap.description = swap.description;
              _swap.thumbnail = swap.thumbnail;
              _swap.unit_price = swap.unit_price;
              _swap.tax_rate = swap.tax_rate;
              _swap.discount_price = swap.discount_price;
              _swap.currency_unit = swap.currency_unit;
              _swap.metadata = swap.metadata;
              return _swap;
            });

            return _item;
          })
        );

        await this.repo.save(exchange);
      }
      return 1;
    }
    const update = await this.repo.update(where, data);
    return update.affected || 0;
  }
}
