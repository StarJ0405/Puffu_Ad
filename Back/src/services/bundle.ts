import { BaseService } from "data-source";
import { EventBundle } from "models/bundle";
import { BundleRepository } from "repositories/bundle";
import { BundleProductRepository } from "repositories/bundle-product";
import { BundleVaraintRepository } from "repositories/bundle-variant";

import { inject, injectable } from "tsyringe";
import { FindOptionsWhere, In, Not } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

@injectable()
export class EventBundleService extends BaseService<
  EventBundle,
  BundleRepository
> {
  constructor(
    @inject(BundleRepository)
    bundleRepository: BundleRepository,
    @inject(BundleProductRepository)
    protected bundleProductRepository: BundleProductRepository,
    @inject(BundleVaraintRepository)
    protected bundleVaraintRepository: BundleVaraintRepository
  ) {
    super(bundleRepository);
  }
  async update(
    where: FindOptionsWhere<EventBundle> | FindOptionsWhere<EventBundle>[],
    data: QueryDeepPartialEntity<EventBundle>,
    returnEnttiy?: boolean
  ): Promise<UpdateResult<EventBundle>> {
    const bundles = await this.repository.findAll({
      where,
      relations: ["products", "variants"],
    });
    if (data.products && data?.products?.length > 0) {
      const products = data.products;
      await Promise.all(
        bundles.map(async (bundle) => {
          await this.bundleProductRepository.delete({
            bundle_id: bundle.id,
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
                  await this.bundleProductRepository.create({
                    bundle_id: bundle.id,
                    product_id: product.product_id,
                  })
              )
          );
        })
      );
      delete data.products;
    }
    if (data.variants && data?.variants?.length > 0) {
      const variants = data.variants;
      await Promise.all(
        bundles.map(async (bundle) => {
          await this.bundleVaraintRepository.delete({
            bundle_id: bundle.id,
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
                  await this.bundleVaraintRepository.create({
                    bundle_id: bundle.id,
                    variant_id: variant.variant_id,
                  })
              )
          );
        })
      );

      delete data.variants;
    }
    return super.update(where, data, returnEnttiy);
  }
  async delete(
    where: FindOptionsWhere<EventBundle> | FindOptionsWhere<EventBundle>[],
    soft: boolean = true
  ): Promise<number> {
    const bundles = await this.repository.findAll({ where, select: ["id"] });
    await Promise.all(
      bundles.map(async (bundle) => {
        await this.bundleProductRepository.delete(
          {
            bundle_id: bundle.id,
          },
          soft
        );
        await this.bundleVaraintRepository.delete(
          {
            bundle_id: bundle.id,
          },
          soft
        );
      })
    );
    return super.delete(where, soft);
  }
}
