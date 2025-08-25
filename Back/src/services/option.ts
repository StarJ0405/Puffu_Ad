import { BaseService } from "data-source";
import { Option } from "models/option";
import { OptionRepository } from "repositories/option";
import { OptionValueRepository } from "repositories/option-value";
import { ProductRepository } from "repositories/product";
import { inject, injectable } from "tsyringe";
import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
} from "typeorm";

@injectable()
export class OptionService extends BaseService<Option, OptionRepository> {
  constructor(
    @inject(OptionRepository) optionRepository: OptionRepository,
    @inject(OptionValueRepository)
    protected optionValueRepository: OptionValueRepository,
    @inject(ProductRepository)
    protected productRepository: ProductRepository
  ) {
    super(optionRepository);
  }

  async create(data: DeepPartial<Option>): Promise<Option> {
    const option = await super.create(data);
    if (option.product_id) {
      const product = await this.productRepository.findOne({
        where: {
          id: option.product_id,
        },
        relations: ["variants"],
      });
      if (product?.variants) {
        await Promise.all(
          product.variants.map(
            async (variant) =>
              await this.optionValueRepository.create({
                option_id: option.id,
                variant_id: variant.id,
                value: "default",
              })
          )
        );
      }
    }
    return option;
  }
  async creates(data: DeepPartial<Option>, amount: number): Promise<Option[]> {
    const options = await super.creates(data, amount);
    await Promise.all(
      options.map(async (option) => {
        if (option.product_id) {
          const product = await this.productRepository.findOne({
            where: {
              id: option.product_id,
            },
            relations: ["variants"],
          });
          if (product?.variants) {
            await Promise.all(
              product.variants.map(
                async (variant) =>
                  await this.optionValueRepository.create({
                    option_id: option.id,
                    variant_id: variant.id,
                    value: "default",
                  })
              )
            );
          }
        }
      })
    );
    return options;
  }
  async getPageable(
    pageData: PageData,
    options: FindOneOptions<Option>
  ): Promise<Pageable<Option>> {
    if (options) {
      if (!options?.order) {
        options.order = {
          created_at: "DESC",
          id: "ASC",
        };
      }
    }
    return super.getPageable(pageData, options);
  }
  async getList(options?: FindManyOptions<Option>): Promise<Option[]> {
    if (options) {
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
    where: FindOptionsWhere<Option> | FindOptionsWhere<Option>[],
    soft: boolean = true
  ): Promise<number> {
    const option = await this.repository.findOne({ where });
    if (option) {
      await this.optionValueRepository.delete({
        option_id: option.id,
      });
    }
    return super.delete(where, soft);
  }
}
