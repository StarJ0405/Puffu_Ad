import { BaseRepository } from "data-source";
import { QA } from "models/qa";
import { inject, injectable } from "tsyringe";
import { EntityManager } from "typeorm";

@injectable()
export class QARepository extends BaseRepository<QA> {
  constructor(@inject("dataSource") public readonly manager: EntityManager) {
    super(manager, QA);
  }
}
