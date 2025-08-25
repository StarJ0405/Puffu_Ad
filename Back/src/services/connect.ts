import { BaseService } from "data-source";
import { Connect } from "models/connect";
import { ConnectRepository } from "repositories/connect";
import { ConnectCodeRepository } from "repositories/connect-code";
import { inject, injectable } from "tsyringe";
import { DeepPartial, In } from "typeorm";
import { generateShortId } from "utils/functions";

@injectable()
export class ConnectService extends BaseService<Connect, ConnectRepository> {
  constructor(
    @inject(ConnectRepository) connectRepository: ConnectRepository,
    @inject(ConnectCodeRepository)
    protected connectCodeRepository: ConnectCodeRepository
  ) {
    super(connectRepository);
  }
  async reset(id: string): Promise<string> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) throw Error("unknown appid");
    const secret = generateShortId(16, 16);
    this.repository.update({ id: entity.id }, { secret });

    return secret;
  }

  async create(data: DeepPartial<Connect>): Promise<Connect> {
    let isUnique = false;
    let appid = generateShortId(24);
    do {
      const entity = await this.repository.findOne({
        where: {
          appid,
        },
      });
      if (!entity) isUnique = true;
      else appid = generateShortId(24);
    } while (!isUnique);
    const secret = generateShortId(16, 16);
    return await this.repository.create({ ...data, appid, secret });
  }
  async creates(
    data: DeepPartial<Connect>,
    amount: number
  ): Promise<Connect[]> {
    if (amount <= 0) throw Error("amount must be more than 0");

    let array = Array.from({ length: amount }).map(() => ({
      ...data,
      appid: generateShortId(24),
      secret: generateShortId(16, 16),
    }));
    let isUnique = false;
    do {
      const entities = await this.repository.findAll({
        where: {
          appid: In(array.map((connect) => connect.appid)),
        },
      });
      if (entities.length === 0) isUnique = true;
      else
        array = array.map((connect) => {
          if (entities.some((s) => s.appid === connect.appid))
            connect.appid = generateShortId(24);
          return connect;
        });
    } while (!isUnique);

    return await this.repository.creates(array);
  }

  async getByIdSecret(appid: string, secret: string): Promise<Connect | null> {
    const entity = await this.repository.findOne({
      where: {
        appid,
        secret,
      },
    });
    return entity;
  }
}
