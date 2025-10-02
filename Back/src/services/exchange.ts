import { BaseService } from "data-source";
import { Exchange } from "models/exchange";
import { ExchangeRepository } from "repositories/exchange";
import { ExchangeItemRepository } from "repositories/exchange_item";
import { LogRepository } from "repositories/log";
import { SwapItemRepository } from "repositories/swap_item";
import { VariantRepository } from "repositories/variant";
import { inject, injectable } from "tsyringe";
import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  In,
} from "typeorm";
import { GroupService } from "./group";
import { PointService } from "./point";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

@injectable()
export class ExchangeService extends BaseService<Exchange, ExchangeRepository> {
  constructor(
    @inject(ExchangeRepository) exchangeRepository: ExchangeRepository,
    @inject(ExchangeItemRepository)
    protected exchangeItemRepository: ExchangeItemRepository,
    @inject(VariantRepository)
    protected variantRepository: VariantRepository,
    @inject(SwapItemRepository)
    protected swapItemRepository: SwapItemRepository,
    @inject(LogRepository)
    protected logRepository: LogRepository,
    @inject(PointService)
    protected pointService: PointService,
    @inject(GroupService)
    protected groupService: GroupService
  ) {
    super(exchangeRepository);
  }
  async create(data: DeepPartial<Exchange>): Promise<Exchange> {
    if (data.items) {
      await Promise.all(
        data.items.map(async (item) =>
          item.swaps?.map(
            async (swap) =>
              await this.variantRepository.update(
                {
                  id: swap.variant_id,
                },
                {
                  stack: () => `stack - ${swap.quantity}`,
                }
              )
          )
        )
      );
    }
    return super.create(data);
  }

  async getPageable(
    pageData: PageData,
    options: FindOneOptions<Exchange>
  ): Promise<Pageable<Exchange>> {
    if (options) {
      if (options.where) {
        let where: any = options.where;
        if (where.q) {
          const q = where.q;
          delete where.q;

          const _keyword = ["id"];

          where = this.Search(where, _keyword, q);

          if (options.relations) {
            const relations = Array.isArray(options.relations)
              ? options.relations
              : [options.relations];
            const _where: any[] = [];
            const _relations: any[] = [];
            if (
              relations.some(
                (relation) =>
                  typeof relation === "string" && relation.includes("order")
              )
            ) {
              _where.push(this.Search({}, ["order.display", "order.id"], q));
              _relations.push("order");
            }
            if (
              relations.some(
                (relation) =>
                  typeof relation === "string" &&
                  relation.includes("items.item")
              )
            ) {
              _where.push(
                this.Search(
                  {},
                  ["items.item.product_title", "items.item.variant_title"],
                  q,
                  true
                )
              );
              _relations.push("items.item");
            }
            if (
              relations.some(
                (relation) =>
                  typeof relation === "string" &&
                  relation.includes("items.swaps")
              )
            ) {
              _where.push(
                this.Search(
                  {},
                  ["items.swaps.product_title", "items.swaps.variant_title"],
                  q,
                  true
                )
              );
              _relations.push("items.swaps");
            }
            if (
              relations.some(
                (relation) =>
                  typeof relation === "string" &&
                  relation.includes("order.user")
              )
            ) {
              _where.push(..._where, this.Search({}, ["order.user.name"], q));
              _relations.push("order.user");
            }

            if (_where.length > 0) {
              const list = await super.getList({
                select: ["id"],
                where: _where,
                relations: _relations,
              });

              where = [
                ...(Array.isArray(where) ? where : [where]),
                { ...options.where, id: In(list.map((order) => order.id)) },
              ];
            }
          }

          options.where = where;
        }
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
  async getList(options?: FindManyOptions<Exchange>): Promise<Exchange[]> {
    if (options) {
      if (options.where) {
        let where: any = options.where;
        if (where.q) {
          const q = where.q;
          delete where.q;

          const _keyword = ["id"];

          where = this.Search(where, _keyword, q);

          if (options.relations) {
            const relations = Array.isArray(options.relations)
              ? options.relations
              : [options.relations];
            const _where: any[] = [];
            const _relations: any[] = [];
            if (
              relations.some(
                (relation) =>
                  typeof relation === "string" && relation.includes("order")
              )
            ) {
              _where.push(this.Search({}, ["order.display", "order.id"], q));
              _relations.push("order");
            }
            if (
              relations.some(
                (relation) =>
                  typeof relation === "string" &&
                  relation.includes("items.item")
              )
            ) {
              _where.push(
                this.Search(
                  {},
                  ["items.item.product_title", "items.item.variant_title"],
                  q,
                  true
                )
              );
              _relations.push("items.item");
            }
            if (
              relations.some(
                (relation) =>
                  typeof relation === "string" &&
                  relation.includes("order.user")
              )
            ) {
              _where.push(..._where, this.Search({}, ["order.user.name"], q));
              _relations.push("order.user");
            }

            if (_where.length > 0) {
              const list = await super.getList({
                select: ["id"],
                where: _where,
                relations: _relations,
              });

              where = [
                ...(Array.isArray(where) ? where : [where]),
                { ...options.where, id: In(list.map((order) => order.id)) },
              ];
            }
          }

          options.where = where;
        }
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
  async update(
    where: FindOptionsWhere<Exchange> | FindOptionsWhere<Exchange>[],
    data: QueryDeepPartialEntity<Exchange>,
    returnEnttiy?: boolean
  ): Promise<UpdateResult<Exchange>> {
    if (data.completed_at) {
      const finds = await this.repository.findAll({
        where,
        relations: ["items.item"],
      });
      await Promise.all(
        finds.map(
          async (exchange) =>
            await Promise.all(
              (exchange.items || [])?.map(
                async (item) =>
                  await this.variantRepository.update(
                    {
                      id: item.item?.variant_id,
                    },
                    { stack: () => `stack - ${item.quantity}` }
                  )
              )
            )
        )
      );
    }
    return super.update(where, data, returnEnttiy);
  }

  async delete(
    where: FindOptionsWhere<Exchange> | FindOptionsWhere<Exchange>[],
    soft?: boolean
  ): Promise<number> {
    const exchanges = await this.repository.findAll({
      where,
      relations: ["items.swaps"],
    });
    await Promise.all(
      exchanges.map(async (exchange) => {
        await Promise.all(
          (exchange?.items || [])?.map(async (item) => {
            await Promise.all(
              (item.swaps || [])?.map(
                async (swap) =>
                  await this.variantRepository.update(
                    {
                      id: swap.variant_id,
                    },
                    {
                      stack: () => `stack + ${swap.quantity}`,
                    }
                  )
              )
            );
            await this.swapItemRepository.delete({
              exchange_item_id: item.id,
            });
          })
        );
        await this.exchangeItemRepository.delete({
          exchange_id: exchange.id,
        });
      })
    );
    return await super.delete(where, soft);
  }
}
