import { BaseRepository } from "data-source";
import { Address } from "models/address";
import { inject, injectable } from "tsyringe";
import { EntityManager } from "typeorm";

@injectable()
export class AddressRepository extends BaseRepository<Address> {
  constructor(@inject("dataSource") public readonly manager: EntityManager) {
    super(manager, Address);
  }
}
