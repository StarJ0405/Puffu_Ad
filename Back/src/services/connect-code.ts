import { BaseService } from "data-source";
import { ConnectCode } from "models/connect-code";
import { ConnectCodeRepository } from "repositories/connect-code";
import { inject, injectable } from "tsyringe";
import { DeepPartial, LessThan } from "typeorm";
import { generateShortId } from "utils/functions";

@injectable()
export class ConnectCodeService extends BaseService<
  ConnectCode,
  ConnectCodeRepository
> {
  constructor(
    @inject(ConnectCodeRepository) connectcodeRepository: ConnectCodeRepository
  ) {
    super(connectcodeRepository);
  }
  async create(data: DeepPartial<ConnectCode>): Promise<ConnectCode> {
    let isUnique = false;
    let code = generateShortId(24);
    do {
      const entity = await this.repository.findOne({
        where: {
          code,
          appid: data.appid,
        },
      });
      if (!entity) isUnique = true;
      else code = generateShortId(24);
    } while (!isUnique);
    return await this.repository.create({ ...data, code });
  }
  async creates(
    data: DeepPartial<ConnectCode>,
    amount: number
  ): Promise<ConnectCode[]> {
    if (amount <= 0) throw Error("amount must be more than 0");

    let array = Array.from({ length: amount }).map(() => ({
      ...data,
      code: generateShortId(24),
    }));
    let isUnique = false;
    do {
      const entities = await this.repository.findAll({
        where: array.map((connectcode) => ({
          appid: connectcode.appid,
          code: connectcode.code,
        })),
      });
      if (entities.length === 0) isUnique = true;
      else
        array = array.map((connectcode) => {
          if (
            entities.some(
              (s) =>
                s.code === connectcode.code && s.appid === connectcode.appid
            )
          )
            connectcode.code = generateShortId(24);
          return connectcode;
        });
    } while (!isUnique);

    return await this.repository.creates(array);
  }

  async getWithValid(appid: string, code: string): Promise<ConnectCode | null> {
    const entity = await this.repository.findOne({
      where: {
        appid,
        code,
      },
      relations: ["user"],
    });

    if (
      entity?.expires_at &&
      entity?.expires_at?.getTime() > new Date().getTime()
    )
      return entity;
    return null;
  }
  async removeExpires(): Promise<void> {
    await this.repository.delete({ expires_at: LessThan(new Date()) }, false);
  }
}
