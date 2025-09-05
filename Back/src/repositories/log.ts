import { BaseRepository } from "data-source";
import { Log } from "models/log";
import { inject, injectable } from "tsyringe";
import { EntityManager } from "typeorm";

@injectable()
export class LogRepository extends BaseRepository<Log> {
  constructor(@inject("dataSource") public readonly manager: EntityManager) {
    super(manager, Log);
  }
}
