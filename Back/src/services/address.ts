import { BaseService } from "data-source";
import { Address } from "models/address";
import { AddressRepository } from "repositories/address";
import { inject, injectable } from "tsyringe";
import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
} from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

@injectable()
export class AddressService extends BaseService<Address, AddressRepository> {
  constructor(@inject(AddressRepository) addressRepository: AddressRepository) {
    super(addressRepository);
  }
  async getPageable(
    pageData: PageData,
    options: FindOneOptions<Address>
  ): Promise<Pageable<Address>> {
    if (options) {
      if (!options?.order) {
        options.order = {
          created_at: "DESC",
          id: "ASC",
        };
      }
    }
    return super.getPageable(pageData, options);
  }
  async getList(options?: FindManyOptions<Address>): Promise<Address[]> {
    if (options) {
      if (!options?.order) {
        options.order = {
          created_at: "DESC",
          id: "ASC",
        };
      }
    }
    return super.getList(options);
  }
  async create(data: DeepPartial<Address>): Promise<Address> {
    if (data.user_id) {
      const count = await this.repository.count({
        where: {
          user_id: data.user_id,
          default: true,
        },
      });
      if (count === 0) {
        data.default = true;
      } else if (data.default) {
        await this.repository.update(
          {
            user_id: data.user_id,
          },
          {
            default: false,
          }
        );
      }
    } else data.default = false;

    return super.create(data);
  }
  async creates(
    data: DeepPartial<Address>,
    amount: number
  ): Promise<Address[]> {
    data.default = false;

    const result = await super.creates(data, amount);
    if (data.user_id && result?.length > 0) {
      const count = await this.repository.count({
        where: {
          user_id: data.user_id,
          default: true,
        },
      });
      if (count === 0)
        await this.repository.update(
          {
            id: result[0].id,
          },
          { default: true }
        );
    }

    return result;
  }
  async update(
    where: FindOptionsWhere<Address> | FindOptionsWhere<Address>[],
    data: QueryDeepPartialEntity<Address>,
    returnEnttiy?: boolean
  ): Promise<UpdateResult<Address>> {
    if (data.default) {
      const addr = await this.get({ where });
      if (addr?.user_id)
        await super.update(
          {
            user_id: addr.user_id,
          },
          {
            default: false,
          }
        );
    }
    return super.update(where, data, returnEnttiy);
  }
  async delete(
    where: FindOptionsWhere<Address> | FindOptionsWhere<Address>[],
    soft?: boolean
  ): Promise<number> {
    const address = await this.repository.findAll({ where });
    const defaultAddress = address.filter((f) => f.default);
    const result = await super.delete(where, soft);
    if (defaultAddress?.length > 0) {
      await Promise.all(
        defaultAddress.map(async (address) => {
          if (!address.user_id) return;
          const one = await this.repository.findOne({
            where: {
              user_id: address.user_id,
            },
          });
          if (one)
            await this.repository.update(
              {
                id: one.id,
              },
              {
                default: true,
              }
            );
        })
      );
    }
    return result;
  }
}
