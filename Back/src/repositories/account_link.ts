import { BaseRepository } from "data-source";
import { AccountLink } from "models/account_link";
import { inject, injectable } from "tsyringe";
import { EntityManager } from "typeorm";

@injectable()
export class AccountLinkRepository extends BaseRepository<AccountLink> {
  constructor(@inject("dataSource") public readonly manager: EntityManager) {
    super(manager, AccountLink);
  }
}
