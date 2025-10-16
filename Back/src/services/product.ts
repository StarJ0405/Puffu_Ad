import { BaseService } from "data-source";
import { Product } from "models/product";
import { CategoryRepository } from "repositories/category";
import { LineItemRepository } from "repositories/line_item";
import { OptionRepository } from "repositories/option";
import { OptionValueRepository } from "repositories/option-value";
import { ProductRepository } from "repositories/product";
import { VariantRepository } from "repositories/variant";
import { inject, injectable } from "tsyringe";
import {
  Brackets,
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
    @inject(CategoryRepository)
    protected categoryRepository: CategoryRepository,
    @inject(OptionRepository) protected optionRepository: OptionRepository,
    @inject(OptionValueRepository)
    protected optionValueRepository: OptionValueRepository
  ) {
    super(productRepository);
  }
  async getWithOrder(
    options: FindOneOptions<Product>,
    pageData?: PageData
  ): Promise<Pageable<Product> | any> {
    const where: any = options?.where || {};
    let builder = this.repository
      .builder("p")
      .leftJoinAndSelect("p.variants", "v")
      .leftJoinAndSelect("p.brand", "b")
      .leftJoinAndSelect("p.discounts", "ds")
      .leftJoinAndSelect("ds.discount", "dc");
    if (where.user_id)
      builder = builder.leftJoinAndSelect(
        "p.wishlists",
        "wis",
        "wis.user_id = :user_id",
        { user_id: where.user_id }
      );
    builder = builder
      .leftJoin("p.categories", "ct")
      .where("p.visible IS TRUE")
      .andWhere("v.visible IS TRUE");

    if (where && "warehousing" in where) {
      const value = where.warehousing ? "TRUE" : "FALSE";
      builder = builder.andWhere(`p.warehousing IS ${value}`);
    } else {
      builder = builder.andWhere("p.warehousing IS FALSE");
    }

    /*     if ("warehousing" in where) {
    // 명시적 true/false 필터만 적용
      builder = builder.andWhere("p.warehousing IS :warehousing", {
        warehousing: where.warehousing,
      });
    }
    // else 블록 제거 → 전달 없을 때는 모든 상품 포함 */

    if (where) {
      if (where.ids) {
        builder = builder.andWhere(
          `p.id in (${String(where.ids)
            .split(",")
            .map((id: string) => `'${id}'`)
            .join(",")})`
        );
      }
      if (where.store_id) {
        builder = builder.andWhere("p.store_id = :store_id", {
          store_id: where.store_id,
        });
      }
      if ("adult" in where) {
        builder = builder.andWhere(`p.adult is ${where.adult}`);
      }
      // if (where.user_id) {
      //   builder = builder.andWhere(
      //     new Brackets((sub) =>
      //       sub
      //         .where("wis.user_id is null")
      //         .orWhere("wis.user_id = :user_id", { user_id: where.user_id })
      //     )
      //   );
      // }
      if (where.category_id) {
        builder = builder.andWhere(`ct.mpath LIKE :category_id`, {
          category_id: `%${where.category_id}%`,
        });
      }
      if (where.categories) {
        const categories = Array.isArray(where.categories)
          ? where.categories
          : [where.categories];
        builder = builder.andWhere(
          `ct.mpath LIKE ANY (ARRAY[${categories.map(
            (cat: string) => `'%${cat}%'`
          )}])`
        );
      }
      if (where.q) {
        const q = where.q;
        builder = builder.andWhere(
          new Brackets((sub) =>
            sub
              .where(
                `fn_text_to_char_array(p.title) @> fn_text_to_char_array(:q)`,
                {
                  q,
                }
              )
              .orWhere(
                `fn_text_to_char_array(p.id) @> fn_text_to_char_array(:q)`
              )
          )
        );
      }
    }
    if (options.order) {
      const order: any = options.order;

      switch (String(order).toLowerCase()) {
        case "recommend": {
          builder = builder
            .leftJoin(
              "(SELECT product_id AS id, COUNT(*) AS wish FROM public.wishlist GROUP BY product_id)",
              "wish",
              "wish.id = p.id"
            )
            .addSelect("COALESCE(wish.wish,0)", "wish")
            .orderBy("wish", "DESC")
            .addOrderBy("p.created_at", "DESC");
          break;
        }
        case "low_price": {
          builder = builder
            .leftJoin(
              `(SELECT dp.product_id AS id, MAX(value) as value
                FROM discount_product dp 
                  JOIN event_discount ed ON ed.id = dp.discount_id
                    JOIN public.event ev ON ev.id = ed.event_id 
                WHERE 
                  (NOW() BETWEEN ev.starts_at AND ev.ends_at)
                  OR (ev.starts_at IS NULL AND ev.ends_at > NOW())
                  OR (ev.ends_at IS NULL AND ev.starts_at < NOW())
                  OR (ev.starts_at IS NULL AND ev.ends_at IS NULL)
                GROUP BY dp.product_id)`,
              "discount",
              "discount.id = p.id"
            )
            .addSelect(
              `p.price * (100.0 - COALESCE(discount.value,0))/100.0`,
              "dpc"
            )
            .orderBy("dpc", "ASC")
            .addOrderBy("p.created_at", "DESC");
          break;
        }
        case "high_price": {
          builder = builder
            .leftJoin(
              `(SELECT dp.product_id AS id, MAX(value) as value
                  FROM discount_product dp 
                    JOIN event_discount ed ON ed.id = dp.discount_id
                      JOIN public.event ev ON ev.id = ed.event_id 
                  WHERE 
                    (NOW() BETWEEN ev.starts_at AND ev.ends_at)
                    OR (ev.starts_at IS NULL AND ev.ends_at > NOW())
                    OR (ev.ends_at IS NULL AND ev.starts_at < NOW())
                    OR (ev.starts_at IS NULL AND ev.ends_at IS NULL)
                  GROUP BY dp.product_id)`,
              "discount",
              "discount.id = p.id"
            )
            .addSelect(
              `p.price * (100.0 - COALESCE(discount.value,0))/100.0`,
              "dpc"
            )
            .orderBy("dpc", "DESC")
            .addOrderBy("p.created_at", "DESC");
          break;
        }
        case "sell": {
          builder = builder
            .leftJoin(
              `(SELECT v.product_id AS id, SUM(l.quantity + l.extra_quantity) AS sell FROM line_item l JOIN "order" o on l.order_id = o.id JOIN variant v ON v.id = l.variant_id GROUP BY v.product_id)`,
              "sell",
              "sell.id = p.id"
            )
            .addSelect(`COALESCE(sell.sell,0)`, "sell")
            .orderBy("sell", "DESC")
            .addOrderBy("p.created_at", "DESC");
          break;
        }
        case "review": {
          builder = builder
            .leftJoin(
              `(SELECT v.product_id AS id, count(DISTINCT rv.id) AS review FROM review rv JOIN line_item l ON rv.item_id = l.id JOIN variant v ON v.id = l.variant_id GROUP BY v.product_id)`,
              "review",
              "review.id = p.id"
            )
            .addSelect(`COALESCE(review.review,0)`, "review")
            .orderBy("review", "DESC")
            .addOrderBy("p.created_at", "DESC");
          break;
        }

        case "best": {
          builder = builder
            .leftJoin(
              `(SELECT v.product_id AS id, SUM(l.quantity + l.extra_quantity) AS sell FROM line_item l JOIN variant v ON v.id = l.variant_id JOIN "order" o on l.order_id = o.id WHERE o.created_at >= CURRENT_TIMESTAMP - INTERVAL '7 days' GROUP BY v.product_id)`,
              "best_week",
              "best_week.id = p.id"
            )
            .leftJoin(
              `(SELECT v.product_id AS id, SUM(l.quantity + l.extra_quantity) AS sell FROM line_item l JOIN variant v ON v.id = l.variant_id JOIN "order" o on l.order_id = o.id WHERE o.created_at >= CURRENT_TIMESTAMP - INTERVAL '1 month' GROUP BY v.product_id)`,
              "best_month",
              "best_month.id = p.id"
            )
            .addSelect("COALESCE(best_week.sell,0)", "best_week")
            .addSelect("COALESCE(best_month.sell,0)", "best_month")
            .orderBy("best_week", "DESC")
            .addOrderBy("best_month", "DESC")
            .addOrderBy("p.created_at", "DESC");
          break;
        }
        case "discount": {
          builder = builder
            .innerJoin(
              `(SELECT dp.product_id AS id, MAX(ed.value) AS discount 
                  FROM public.discount_product dp 
                    JOIN public.event_discount ed ON ed.id = dp.discount_id 
                    JOIN public.event ev ON ev.id = ed.event_id 
                  WHERE 
                    (NOW() BETWEEN ev.starts_at AND ev.ends_at)
                    OR (ev.starts_at IS NULL AND ev.ends_at > NOW())
                    OR (ev.ends_at IS NULL AND ev.starts_at < NOW())
                    OR (ev.starts_at IS NULL AND ev.ends_at IS NULL)
                  GROUP BY dp.product_id)`,
              "discount",
              "discount.id = p.id"
            )
            .addSelect(`COALESCE(discount.discount,0)`, "discount")
            .orderBy("discount", "DESC")
            .addOrderBy("p.created_at", "DESC");
        }
        case "hot": {
          builder = builder
            .leftJoin(
              `(SELECT rec.product_id AS id,count(*) AS hot FROM recent rec WHERE rec.created_at >= CURRENT_TIMESTAMP - INTERVAL '3 month' GROUP BY rec.product_id)`,
              "hot",
              "hot.id = p.id"
            )
            .addSelect("COALESCE(hot.hot,0)", "hot")
            .orderBy("hot", "DESC")
            .addOrderBy("p.created_at", "DESC");
          break;
        }
        case "random": {
          builder = builder
            .addSelect("Random()", "rand")
            .orderBy("rand", "DESC")
            .addOrderBy("p.created_at", "DESC");
          break;
        }
        default: {
          builder = builder.orderBy("p.created_at", "DESC");
          break;
        }
      }
    } else builder = builder.orderBy("p.created_at", "DESC");

    if (pageData) {
      const { pageSize, pageNumber = 0 } = pageData;
      const NumberOfTotalElements = await builder.getCount();
      const content = await builder
        .take(pageSize)
        .skip(pageNumber * pageSize)
        .getMany();
      const NumberOfElements = content.length;
      const totalPages =
        pageSize > 0 ? Math.ceil(NumberOfTotalElements / pageSize) : 0;
      const last = pageNumber === totalPages - 1;
      return {
        content,
        pageSize,
        pageNumber,
        NumberOfTotalElements,
        NumberOfElements,
        totalPages,
        last,
      };
    } else {
      return await builder.getMany();
    }
  }
  async getPageable(
    pageData: PageData,
    options: FindOneOptions<Product>
  ): Promise<Pageable<Product>> {
    if (options) {
      let where: any = options.where;
      if (where.ids) {
        const ids = where.ids;
        delete where.ids;
        where.id = In(Array.isArray(ids) ? ids : [ids]);
        options.where = where;
      }
      if (where.category_id) {
        const categories = await this.repository.query(
          `SELECT id FROM public.category WHERE mpath like '%${where.category_id}%'`
        );
        where.categories = {
          id: In(categories.map((category: { id: string }) => category.id)),
        };
        options.where = where;
        if (options.relations) {
          options.relations = (
            Array.isArray(options.relations)
              ? options.relations
              : [options.relations]
          ) as any[];
          options.relations.push("categories");
        } else options.relations = ["categories"];
      }
      delete where.category_id;
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
                typeof relation === "string" && relation.includes("variants")
            )
          ) {
            _where.push(this.Search({}, ["variants.title"], q, true));
            _relations.push("variants");
          }
          if (
            relations.some(
              (relation) =>
                typeof relation === "string" && relation.includes("brand")
            )
          ) {
            _where.push(this.Search({}, ["brand.name"], q, true));
            _relations.push("brand");
          }

          if (_where.length > 0) {
            const list = await super.getList({
              select: ["id"],
              where: _where,
              relations: _relations,
            });

            where = [
              ...(Array.isArray(where) ? where : [where]),
              { ...options.where, id: In(list.map((product) => product.id)) },
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
      if (where.ids) {
        const ids = where.ids;
        delete where.ids;
        where.id = In(Array.isArray(ids) ? ids : [ids]);
        options.where = where;
      }
      if (where.category_id) {
        const categories = await this.repository.query(
          `SELECT id FROM public.category WHERE mpath like '%${where.category_id}%'`
        );
        where.categories = {
          id: In(categories.map((category: { id: string }) => category.id)),
        };
        options.where = where;
        if (options.relations) {
          options.relations = (
            Array.isArray(options.relations)
              ? options.relations
              : [options.relations]
          ) as any[];
          options.relations.push("categories");
        } else options.relations = ["categories"];
      }
      delete where.category_id;
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
                typeof relation === "string" && relation.includes("variants")
            )
          ) {
            _where.push(this.Search({}, ["variants.title"], q, true));
            _relations.push("variants");
          }

          if (
            relations.some(
              (relation) =>
                typeof relation === "string" && relation.includes("brand")
            )
          ) {
            _where.push(this.Search({}, ["brand.name"], q, true));
            _relations.push("brand");
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
    return super.getList(options);
  }

  async update(
    where: FindOptionsWhere<Product> | FindOptionsWhere<Product>[],
    data: QueryDeepPartialEntity<Product>,
    returnEntity?: boolean
  ): Promise<UpdateResult<Product>> {
    if (
      ("visible" in data && !data.visible) ||
      ("buyable" in data && !data.buyable) ||
      ("warehousing" in data && data.warehousing)
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
    if (data.categories) {
      const _categories = data.categories as any[];
      delete data.categories;
      const categories = await this.categoryRepository.findAll({
        where: {
          id: In(
            _categories?.map((cat) => (typeof cat === "string" ? cat : cat?.id))
          ),
        },
      });
      const products = await this.repository.findAll({
        where,
        relations: ["categories"],
      });
      await Promise.all(
        products.map(async (product) => {
          product.categories = categories;
          return await this.repository.save(product);
        })
      );
    }
    return super.update(where, data, returnEntity);
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
                thumbnail: "",
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
                thumbnail: "",
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
