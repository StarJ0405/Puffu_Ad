import { BaseRepository } from "data-source";
import { Contract } from "models/contract";
import { Page } from "models/page";
import { InputField } from "models/input_field";
import { ContractUser, ApproveStatus  } from "models/contract_user";
import { inject, injectable } from "tsyringe";
import { EntityManager, DeepPartial } from "typeorm";

@injectable()
export class ContractRepository extends BaseRepository<Contract> {
  constructor(@inject("dataSource") public readonly manager: EntityManager) {
    super(manager, Contract);
  }

  async create(data: DeepPartial<Contract>): Promise<Contract> {
    const contract = this.repo.create({
      name: data.name as string,
      origin_id: data.origin_id ?? null,
    });

    if (data.pages?.length) {
      contract.pages = data.pages.map((p) => {
        const page = new Page();
        page.image = p.image as string;
        page.page = p.page as number;

        if (p.input_fields?.length) {
          page.input_fields = p.input_fields.map((f) => {
            const field = new InputField();
            field.type = f.type as string;
            field.metadata = f.metadata ?? {};
            field.value = f.value ?? {};
            return field;
          });
        }
        return page;
      });
    }

    if (data.contract_users?.length) {
      contract.contract_users = data.contract_users.map((cu) => {
        const user = new ContractUser();
        user.name = cu.name as string;
        user.user_id = cu.user_id ?? null;
        user.approve = (cu.approve as ApproveStatus) ?? ApproveStatus.PENDING;
        return user;
      });
    }

    return this.repo.save(contract);
  }
}
