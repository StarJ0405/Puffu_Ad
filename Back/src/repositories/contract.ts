import { BaseRepository } from "data-source";
import { Contract } from "models/contract";
import { Page } from "models/page";
import { InputField } from "models/input_field";
import { ContractUser, ApproveStatus } from "models/contract_user";
import { inject, injectable } from "tsyringe";
import { EntityManager, DeepPartial } from "typeorm";

@injectable()
export class ContractRepository extends BaseRepository<Contract> {
  constructor(@inject("dataSource") public readonly manager: EntityManager) {
    super(manager, Contract);
  }

  async create(data: DeepPartial<Contract>): Promise<Contract> {
    const contract = new Contract();
    contract.name = data.name as string;
    contract.origin_id = data.origin_id ?? null;

    // 페이지 및 입력필드 구성
    if (data.pages?.length) {
      contract.pages = data.pages.map((p) => {
        const page = new Page();
        page.image = p.image as string;
        page.page = p.page as number;

        if (p.input_fields?.length) {
          page.input_fields = p.input_fields.map((f) =>
            Object.assign(new InputField(), {
              type: f.type as string,
              metadata: f.metadata ?? {},
              value: f.value ?? {},
            })
          );
        }

        return page;
      });
    }

    // 계약 참여자 구성
    if (data.contract_users?.length) {
      contract.contract_users = data.contract_users.map((cu) =>
        Object.assign(new ContractUser(), {
          name: cu.name as string,
          user_id: cu.user_id ?? null,
          approve: (cu.approve as ApproveStatus) ?? ApproveStatus.PENDING,
        })
      );
    }

    return this.repo.save(contract);
  }
}
