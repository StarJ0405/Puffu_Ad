import { injectable } from "tsyringe";
import { EntityManager } from "typeorm";
import { Invitation } from "models/invitation";
import { BaseRepository, BaseService } from "data-source";

@injectable()
export class InvitationRepository extends BaseRepository<Invitation> {
  constructor(manager: EntityManager) {
    super(manager, Invitation);
  }
}

@injectable()
export class InvitationService extends BaseService<
  Invitation,
  InvitationRepository
> {
  constructor(repository: InvitationRepository) {
    super(repository);
  }

  buildWhere(q?: string, store_id?: string, status?: string) {
    const where: any = {};
    if (q) where.email = this.Search({}, "email", q);
    if (store_id) where.store_id = store_id;
    if (status) where.status = status;
    return where;
  }
}
