import { BaseRepository } from "data-source";
import { Option } from "models/option";
import { inject, injectable } from "tsyringe";
import { EntityManager } from "typeorm";

@injectable()
export class OptionRepository extends BaseRepository<Option> {
  constructor(@inject("dataSource") public readonly manager: EntityManager) {
    super(manager, Option);
  }
}
