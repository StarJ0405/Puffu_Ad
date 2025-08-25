import { BaseRepository } from "data-source";
import { OptionValue } from "models/option-value";
import { inject, injectable } from "tsyringe";
import { EntityManager } from "typeorm";

@injectable()
export class OptionValueRepository extends BaseRepository<OptionValue> {
  constructor(@inject("dataSource") public readonly manager: EntityManager) {
    super(manager, OptionValue);
  }
}
