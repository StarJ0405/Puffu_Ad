import { BaseRepository } from "data-source";
import { InputField } from "models/input_field";
import { injectable, inject } from "tsyringe";
import { EntityManager } from "typeorm";

@injectable()
export class InputFieldRepository extends BaseRepository<InputField> {
  constructor(@inject("dataSource") public readonly manager: EntityManager) {
    super(manager, InputField);
  }
}
