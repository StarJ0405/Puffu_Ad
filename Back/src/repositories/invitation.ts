import { injectable, inject } from "tsyringe";
import { EntityManager } from "typeorm";
import { BaseRepository } from "data-source";
import { Invitation } from "models/invitation";

@injectable()
export class InvitationRepository extends BaseRepository<Invitation> {
  constructor(@inject("dataSource") manager: EntityManager) {
    super(manager, Invitation);
  }
}
