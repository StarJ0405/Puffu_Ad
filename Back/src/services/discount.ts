import { BaseService } from "data-source";
import { EventDiscount } from "models/discount";
import { DiscountRepository } from "repositories/discount";
import { DiscountProductRepository } from "repositories/discount-product";
import { DiscountVaraintRepository } from "repositories/discount-variant";

import { inject, injectable } from "tsyringe";
import { FindOptionsWhere, In, Not } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

@injectable()
export class EventDiscountService extends BaseService<
  EventDiscount,
  DiscountRepository
> {
  constructor(
    @inject(DiscountRepository)
    discountRepository: DiscountRepository,
    @inject(DiscountProductRepository)
    protected discountProductRepository: DiscountProductRepository,
    @inject(DiscountVaraintRepository)
    protected discountVaraintRepository: DiscountVaraintRepository
  ) {
    super(discountRepository);
  }
  async update(
    where: FindOptionsWhere<EventDiscount> | FindOptionsWhere<EventDiscount>[],
    data: QueryDeepPartialEntity<EventDiscount>,
    returnEnttiy?: boolean
  ): Promise<UpdateResult<EventDiscount>> {
    const discounts = await this.repository.findAll({
      where,
      relations: ["products", "variants"],
    });

    if (data.products) {
      const products = data.products;
      await Promise.all(
        discounts.map(async (discount) => {
          await this.discountProductRepository.delete({
            discount_id: discount.id,
            id: Not(
              In(
                (products as any[])
                  .filter((f) => !!f.id)
                  .map((product) => String(product.id))
              )
            ),
          });
          await Promise.all(
            (products as any[])
              .filter((f) => !f.id)
              .map(
                async (product) =>
                  await this.discountProductRepository.create({
                    discount_id: discount.id,
                    product_id: product.product_id,
                  })
              )
          );
        })
      );
    }
    delete data.products;
    if (data.variants) {
      const variants = data.variants;
      await Promise.all(
        discounts.map(async (discount) => {
          await this.discountVaraintRepository.delete({
            discount_id: discount.id,
            id: Not(
              In(
                (variants as any[])
                  .filter((f) => !!f.id)
                  .map((variant) => String(variant.id))
              )
            ),
          });
          await Promise.all(
            (variants as any[])
              .filter((f) => !f.id)
              .map(
                async (variant) =>
                  await this.discountVaraintRepository.create({
                    discount_id: discount.id,
                    variant_id: variant.variant_id,
                  })
              )
          );
        })
      );
    }
    delete data.variants;
    return super.update(where, data, returnEnttiy);
  }
  async delete(
    where: FindOptionsWhere<EventDiscount> | FindOptionsWhere<EventDiscount>[],
    soft: boolean = true
  ): Promise<number> {
    const discounts = await this.repository.findAll({ where, select: ["id"] });
    await Promise.all(
      discounts.map(async (discount) => {
        await this.discountProductRepository.delete(
          {
            discount_id: discount.id,
          },
          soft
        );
        await this.discountVaraintRepository.delete(
          {
            discount_id: discount.id,
          },
          soft
        );
      })
    );
    return super.delete(where, soft);
  }
}
