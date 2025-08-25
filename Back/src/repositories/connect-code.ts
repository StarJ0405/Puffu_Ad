import { BaseRepository } from "data-source";
import { ConnectCode } from "models/connect-code";
import { inject, injectable } from "tsyringe";
import { EntityManager } from "typeorm";

@injectable()
export class ConnectCodeRepository extends BaseRepository<ConnectCode> {
  constructor(@inject("dataSource") public readonly manager: EntityManager) {
    super(manager, ConnectCode);
  }
}
