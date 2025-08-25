import { BaseService } from "data-source";
import { OptionValue } from "models/option-value";
import { OptionValueRepository } from "repositories/option-value";
import { inject, injectable } from "tsyringe";
import { FindManyOptions, FindOneOptions } from "typeorm";

@injectable()
export class OptionValueService extends BaseService<
  OptionValue,
  OptionValueRepository
> {
  constructor(
    @inject(OptionValueRepository) optionvalueRepository: OptionValueRepository
  ) {
    super(optionvalueRepository);
  }
  async getPageable(
    pageData: PageData,
    optionvalues: FindOneOptions<OptionValue>
  ): Promise<Pageable<OptionValue>> {
    if (optionvalues) {
      if (!optionvalues?.order) {
        optionvalues.order = {
          created_at: "DESC",
          id: "ASC",
        };
      }
    }
    return super.getPageable(pageData, optionvalues);
  }
  async getList(
    optionvalues?: FindManyOptions<OptionValue>
  ): Promise<OptionValue[]> {
    if (optionvalues) {
      if (!optionvalues?.order) {
        optionvalues.order = {
          created_at: "DESC",
          id: "ASC",
        };
      }
    }
    return super.getList(optionvalues);
  }
}
