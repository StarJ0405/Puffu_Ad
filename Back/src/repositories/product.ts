import { BaseRepository } from "data-source";
import { Option } from "models/option";
import { OptionValue } from "models/option-value";
import { Product } from "models/product";
import { Variant } from "models/variant";
import { inject, injectable } from "tsyringe";
import { DeepPartial, EntityManager } from "typeorm";

@injectable()
export class ProductRepository extends BaseRepository<Product> {
  constructor(@inject("dataSource") public readonly manager: EntityManager) {
    super(manager, Product);
  }
  async create(data: DeepPartial<Product>): Promise<Product> {
    if (data.options) {
      const product = this.repo.create();
      product.store_id = data.store_id;
      product.brand_id = data.brand_id;
      product.category_id = data.category_id;
      product.title = data.title;
      product.code = data.code;
      product.thumbnail = data.thumbnail;
      product.description = data.description;
      product.detail = data.detail;
      if (data.price) product.price = data.price;
      product.tax_rate = data.tax_rate;
      product.visible = data.visible;
      product.buyable = data.buyable;
      product.tags = data.tags;
      product.adult = data.adult;
      product.metadata = data.metadata;

      const optionsMap = new Map<string, Option>();
      const options = data.options.map((option) => {
        const _option = new Option();
        _option.title = option.title;
        _option.metadata = option.metadata;
        _option.product_id = option.product_id;
        if (option.title) optionsMap.set(option.title, _option);
        return _option;
      });
      const variants = data.variants?.map((variant) => {
        const _variant = new Variant();
        _variant.title = variant.title;
        _variant.code = variant.code;
        _variant.thumbnail = variant.thumbnail;
        if (variant.extra_price) _variant.extra_price = variant.extra_price;
        _variant.stack = variant.stack;
        _variant.visible = variant.visible;
        _variant.buyable = variant.buyable;
        _variant.metadata = variant.metadata;
        const values = variant.values?.map((value) => {
          const _value = new OptionValue();
          _value.value = value.value;
          _value.metadata = value.metadata;
          _value.option_id = value.option_id;
          _value.variant_id = value.variant_id;
          if (value?.option?.title) {
            const relatedOption = optionsMap.get(value?.option?.title);
            if (relatedOption) {
              _value.option = relatedOption;
            }
          }
          _value.variant = _variant;

          return _value;
        });
        _variant.values = values;
        return _variant;
      });
      product.options = options;
      product.variants = variants;
      return this.repo.save(product);
    }
    return super.create(data);
  }
}
