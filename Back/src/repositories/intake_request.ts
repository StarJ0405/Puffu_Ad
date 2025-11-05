import { BaseRepository } from "data-source";
import { inject, injectable } from "tsyringe";
import { EntityManager } from "typeorm";
import { IntakeRequest } from "models/intake_request";

@injectable()
export class IntakeRequestRepository extends BaseRepository<IntakeRequest> {
  constructor(@inject("dataSource") manager: EntityManager) {
    super(manager, IntakeRequest);
  }
}
