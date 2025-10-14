import { BaseService } from "data-source";
import { OptionValue } from "models/option-value";
import { Variant } from "models/variant";
import { LineItemRepository } from "repositories/line_item";
import { OptionValueRepository } from "repositories/option-value";
import { ProductRepository } from "repositories/product";
import { VariantRepository } from "repositories/variant";
import { inject, injectable } from "tsyringe";
import {
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  In,
  IsNull,
} from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

@injectable()
export class VariantService extends BaseService<Variant, VariantRepository> {
  constructor(
    @inject(VariantRepository) variantRepository: VariantRepository,
    @inject(ProductRepository) protected productRepository: ProductRepository,
    @inject(OptionValueRepository)
    protected optionValueRepository: OptionValueRepository,
    @inject(LineItemRepository)
    protected lineItemRepository: LineItemRepository
  ) {
    super(variantRepository);
  }

  async update(
    where: FindOptionsWhere<Variant> | FindOptionsWhere<Variant>[],
    data: QueryDeepPartialEntity<Variant>,
    returnEntity?: boolean
  ): Promise<UpdateResult<Variant>> {
    if (data.values) {
      const values: any[] = Array.isArray(data.values)
        ? data.values
        : [data.values];
      delete data.values;
      await Promise.all(
        values.map(
          async (value: OptionValue) =>
            await this.optionValueRepository.update(
              { id: value.id },
              {
                value: value.value,
              }
            )
        )
      );
    }
    const result = super.update(where, data, returnEntity);
    if (
      ("visible" in data && !data.visible) ||
      ("buyable" in data && !data.buyable) ||
      ("warehousing" in data && data.warehousing)
    ) {
      const variants = await this.repository.findAll({ where });
      if (variants && variants?.length > 0) {
        await Promise.all(
          variants.map(
            async (variant) =>
              await this.lineItemRepository.delete({
                variant_id: variant.id,
                order_id: IsNull(),
              })
          )
        );
        if ("visible" in data && !data.visible) {
          await Promise.all(
            Array.from(
              new Set(variants.map((variant) => variant.product_id))
            ).map(async (id) => {
              const product = await this.productRepository.findOne({
                where: {
                  id,
                  visible: true,
                },
                relations: ["variants"],
              });
              if (
                product?.variants &&
                product.variants.filter((v) => v.visible).length === 0
              ) {
                await this.productRepository.update(
                  {
                    id,
                  },
                  {
                    visible: false,
                  }
                );
              }
            })
          );
        }
      }
    }
    return result;
  }
  async getPageable(
    pageData: PageData,
    options: FindOneOptions<Variant>
  ): Promise<Pageable<Variant>> {
    if (options) {
      let where: any = options.where;
      if (where.q) {
        const q = where.q;
        delete where.q;
        where = this.Search(where, ["title", "id"], q);

        if (options.relations) {
          const relations = Array.isArray(options.relations)
            ? options.relations
            : [options.relations];
          const _where: any[] = [];
          const _relations: any[] = [];
          if (
            relations.some(
              (relation) =>
                typeof relation === "string" && relation.includes("product")
            )
          ) {
            _where.push(
              this.Search({}, ["product.title", "product.id"], q, true)
            );
            _relations.push("product");
          }

          if (
            relations.some(
              (relation) =>
                typeof relation === "string" &&
                relation.includes("product.brand")
            )
          ) {
            _where.push(this.Search({}, ["product.brand.name"], q, true));
            _relations.push("product.brand");
          }

          if (_where.length > 0) {
            const list = await super.getList({
              select: ["id"],
              where: _where,
              relations: _relations,
            });

            where = [
              ...(Array.isArray(where) ? where : [where]),
              { ...options.where, id: In(list.map((variant) => variant.id)) },
            ];
          }
        }

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
  async getList(options?: FindManyOptions<Variant>): Promise<Variant[]> {
    if (options) {
      let where: any = options.where;
      if (where.q) {
        const q = where.q;
        delete where.q;
        where = this.Search(where, ["title", "id"], q);

        if (options.relations) {
          const relations = Array.isArray(options.relations)
            ? options.relations
            : [options.relations];
          const _where: any[] = [];
          const _relations: any[] = [];
          if (
            relations.some(
              (relation) =>
                typeof relation === "string" && relation.includes("product")
            )
          ) {
            _where.push(this.Search({}, ["product.title"], q, true));
            _relations.push("product");
          }

          if (
            relations.some(
              (relation) =>
                typeof relation === "string" &&
                relation.includes("product.brand")
            )
          ) {
            _where.push(this.Search({}, ["product.brand.name"], q, true));
            _relations.push("product.brand");
          }

          if (_where.length > 0) {
            const list = await super.getList({
              select: ["id"],
              where: _where,
              relations: _relations,
            });

            where = [
              ...(Array.isArray(where) ? where : [where]),
              { ...options.where, id: In(list.map((variant) => variant.id)) },
            ];
          }
        }

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
  async delete(
    where: FindOptionsWhere<Variant> | FindOptionsWhere<Variant>[],
    soft: boolean = true
  ): Promise<number> {
    const variants = await this.repository.findAll({ where, select: ["id"] });
    await Promise.all(
      variants.map(
        async (variant) =>
          await this.lineItemRepository.delete({
            variant_id: variant.id,
            order_id: IsNull(),
          })
      )
    );
    await Promise.all(
      variants.map(
        async (variant) =>
          await this.optionValueRepository.delete({
            variant_id: variant.id,
          })
      )
    );

    return super.delete(where, soft);
  }
}
