import { BaseService } from "data-source";
import { AccountLink } from "models/account_link";
import { AccountLinkRepository } from "repositories/account_link";
import { inject, injectable } from "tsyringe";
import { DeepPartial, FindOptionsWhere } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

@injectable()
export class AccountLinkService extends BaseService<
  AccountLink,
  AccountLinkRepository
> {
  constructor(
    @inject(AccountLinkRepository) accountlinkRepository: AccountLinkRepository
  ) {
    super(accountlinkRepository);
  }

  async createOrUpdate(
    data: QueryDeepPartialEntity<AccountLink> & DeepPartial<AccountLink>
  ): Promise<AccountLink | undefined> {
    const find = await this.repository.findOne({
      where: {
        user_id: String(data.user_id),
        type: String(data.type),
        name: String(data.name),
      },
      withDeleted: true,
    });
    if (find) {
      data.deleted_at = null as any;
      const result = await this.update({ id: find.id }, data, true);

      return result.result?.[0];
    } else return this.create(data);
  }
}
