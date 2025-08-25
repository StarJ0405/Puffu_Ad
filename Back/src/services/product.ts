import { BaseService } from "data-source";
import { Product } from "models/product";
import { LineItemRepository } from "repositories/line_item";
import { OptionRepository } from "repositories/option";
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
export class ProductService extends BaseService<Product, ProductRepository> {
  constructor(
    @inject(ProductRepository) productRepository: ProductRepository,
    @inject(VariantRepository) protected variantRepository: VariantRepository,
    @inject(LineItemRepository)
    protected lineItemRepository: LineItemRepository,
    @inject(OptionRepository) protected optionRepository: OptionRepository,
    @inject(OptionValueRepository)
    protected optionValueRepository: OptionValueRepository
  ) {
    super(productRepository);
  }
  async getPageable(
    pageData: PageData,
    options: FindOneOptions<Product>
  ): Promise<Pageable<Product>> {
    if (options) {
      let where: any = options.where;
      if (where.q) {
        const q = where.q;
        delete where.q;

        const _keyword = ["title", "id"];

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
                typeof relation === "string" && relation.includes("variants")
            )
          ) {
            _where.push(this.Search({}, ["variants.title"], q, true));
            _relations.push("variants");
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
      if (!options?.order) {
        options.order = {
          created_at: "DESC",
          id: "ASC",
        };
      }
    }
    return super.getPageable(pageData, options);
  }
  async getList(options?: FindManyOptions<Product>): Promise<Product[]> {
    if (options) {
      let where: any = options.where;
      if (where.q) {
        const q = where.q;
        delete where.q;
        where = this.Search(where, ["title", "id"], q);
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
  async update(
    where: FindOptionsWhere<Product> | FindOptionsWhere<Product>[],
    data: QueryDeepPartialEntity<Product>,
    returnEnttiy?: boolean
  ): Promise<UpdateResult<Product>> {
    if (
      ("visible" in data && !data.visible) ||
      ("buyable" in data && !data.buyable)
    ) {
      const products = await this.repository.findAll({
        where,
        relations: ["variants"],
      });
      await Promise.all(
        products
          .map((product) => product.variants?.map((variant) => variant.id))
          .flat()
          .map(
            async (id) =>
              await this.lineItemRepository.delete({
                variant_id: id,
              })
          )
      );
    }

    return super.update(where, data, returnEnttiy);
  }
  async delete(
    where: FindOptionsWhere<Product> | FindOptionsWhere<Product>[],
    soft: boolean = true
  ): Promise<number> {
    const products = await this.repository.findAll({ where, select: ["id"] });
    await Promise.all(
      products.map(async (product) => {
        const variants = await this.variantRepository.findAll({
          where: {
            product_id: product.id,
          },
        });
        await Promise.all(
          variants.map(
            async (variant) =>
              await this.lineItemRepository.delete({
                variant_id: variant.id,
              })
          )
        );
        await this.variantRepository.delete({
          product_id: product.id,
        });
      })
    );
    return super.delete(where, soft);
  }
  async changeType(
    id: string,
    type: string,
    before: string,
    data: { options?: string[]; title?: string; thumbnail?: string }
  ) {
    if (type === before) return;
    const product = await this.repository.findOne({
      where: {
        id,
      },
      select: ["id"],
      relations: ["variants"],
    } as any);

    if (!product) throw new Error("해당하는 상품이 없습니다.");

    switch (type) {
      case "single": {
        if (product?.variants && product?.variants?.length > 1)
          throw new Error("옵션이 2개 이상입니다.");
        switch (before) {
          case "simple": {
            await this.variantRepository.update(
              {
                product_id: product.id,
                deleted_at: IsNull(),
              },
              {
                title: "",
                extra_price: 0,
                visible: true,
                buyable: true,
              }
            );
            return;
          }
          case "multiple": {
            await this.variantRepository.update(
              {
                product_id: product.id,
                deleted_at: IsNull(),
              },
              {
                title: "",
                extra_price: 0,
                visible: true,
                buyable: true,
              }
            );
            await Promise.all(
              (product.variants || [])?.map(
                async (variant) =>
                  await this.optionValueRepository.delete({
                    variant_id: variant.id,
                  })
              )
            );
            await this.optionRepository.delete({
              product_id: product.id,
            });
            return;
          }
        }
        return;
      }
      case "simple": {
        switch (before) {
          case "single": {
            if (!data.title) return new Error("제목 데이터가 없습니다.");
            await this.variantRepository.update(
              {
                product_id: product.id,
              },
              {
                title: data.title,
                thumbnail: data.thumbnail,
              }
            );
            return;
          }
          case "multiple": {
            await Promise.all(
              (product.variants || [])?.map(
                async (variant) =>
                  await this.optionValueRepository.delete({
                    variant_id: variant.id,
                  })
              )
            );
            await this.optionRepository.delete({
              product_id: product.id,
            });
            return;
          }
        }
        return;
      }
      case "multiple": {
        switch (before) {
          case "single": {
            if (!data.title) return new Error("제목 데이터가 없습니다.");
            if (!data.options) throw new Error("옵션 데이터가 없습니다.");
            if (data?.options?.length < 2)
              throw new Error("옵션 수가 부족합니다");
            await this.variantRepository.update(
              {
                product_id: product.id,
              },
              {
                title: data.title,
                thumbnail: data.thumbnail,
              }
            );
            const options = await Promise.all(
              data.options.map(
                async (option) =>
                  await this.optionRepository.create({
                    product_id: product.id,
                    title: option,
                  })
              )
            );
            await Promise.all(
              (product.variants || [])?.map(
                async (variant) =>
                  await Promise.all(
                    options.map(
                      async (option) =>
                        await this.optionValueRepository.create({
                          variant_id: variant.id,
                          option_id: option.id,
                          value: "default",
                        })
                    )
                  )
              )
            );
            return;
          }
          case "simple": {
            if (!data.options) throw new Error("옵션 데이터가 없습니다.");
            if (data?.options?.length < 2)
              throw new Error("옵션 수가 부족합니다");
            const options = await Promise.all(
              data.options.map(
                async (option) =>
                  await this.optionRepository.create({
                    product_id: product.id,
                    title: option,
                  })
              )
            );
            await Promise.all(
              (product.variants || [])?.map(
                async (variant) =>
                  await Promise.all(
                    options.map(
                      async (option) =>
                        await this.optionValueRepository.create({
                          variant_id: variant.id,
                          option_id: option.id,
                          value: "default",
                        })
                    )
                  )
              )
            );
            return;
          }
        }
        return;
      }
    }
  }
}
