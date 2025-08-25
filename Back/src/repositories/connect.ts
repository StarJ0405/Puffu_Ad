import { BaseRepository } from "data-source";
import { Connect } from "models/connect";
import { inject, injectable } from "tsyringe";
import { EntityManager } from "typeorm";

@injectable()
export class ConnectRepository extends BaseRepository<Connect> {
  constructor(@inject("dataSource") public readonly manager: EntityManager) {
    super(manager, Connect);
  }
}
