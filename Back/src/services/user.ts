import { BaseService } from "data-source";
import { User } from "models/user";
import { UserRepository } from "repositories/user";
import { inject, injectable } from "tsyringe";
import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Raw,
} from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { comparePasswords, hashPassword } from "utils/functions";

@injectable()
export class UserService extends BaseService<User, UserRepository> {
  constructor(@inject(UserRepository) userRepository: UserRepository) {
    super(userRepository);
  }

  async getCount(options?: FindOneOptions<User> | undefined): Promise<number> {
    if (options) {
      let where: any = options.where;
      if (where.birthday) {
        where.birthday = Raw(
          (birthday) =>
            `DATE_PART('month', ${birthday}) = DATE_PART('month', CURRENT_DATE) AND DATE_PART('day', ${birthday}) = DATE_PART('day', CURRENT_DATE)`
        );
        // where.created_at = Raw(alias=>`${alias} <= CURRENT_TIMESTAMP - INTERVAL '1 year'`)
        where.created_at = Raw(
          (alias) => `${alias} <= CURRENT_DATE - INTERVAL '1 year'`
        );
      }
      if (where?.q) {
        const q = where.q;
        delete where.q;
        where = this.Search(
          where,
          ["username", "id", "phone", "nickname", "name"],
          q
        );
        options.where = where;
      }
    }
    return super.getCount(options);
  }
  async getPageable(
    pageData: PageData,
    options: FindOneOptions<User>
  ): Promise<Pageable<User>> {
    if (options) {
      let where: any = options.where;
      if (where.birthday) {
        where.birthday = Raw(
          (birthday) =>
            `DATE_PART('month', ${birthday}) = DATE_PART('month', CURRENT_DATE) AND DATE_PART('day', ${birthday}) = DATE_PART('day', CURRENT_DATE)`
        );
        where.created_at = Raw(
          (alias) => `${alias} <= CURRENT_DATE - INTERVAL '1 year'`
        );
      }
      if (where?.q) {
        const q = where.q;
        delete where.q;
        where = this.Search(
          where,
          ["username", "id", "phone", "nickname", "name"],
          q
        );
        options.where = where;
      }
      if (!options?.order) {
        options.order = {
          created_at: "DESC",
          id: "ASC",
        };
      }
    }
    return super.getPageable(pageData, options);
  }
  async getList(options?: FindManyOptions<User>): Promise<User[]> {
    if (options) {
      let where: any = options.where;
      if (where.birthday) {
        where.birthday = Raw(
          (birthday) =>
            `DATE_PART('month', ${birthday}) = DATE_PART('month', CURRENT_DATE) AND DATE_PART('day', ${birthday}) = DATE_PART('day', CURRENT_DATE)`
        );
        where.created_at = Raw(
          (alias) => `${alias} <= CURRENT_DATE - INTERVAL '1 year'`
        );
      }
      if (where?.q) {
        const q = where.q;
        delete where.q;
        where = this.Search(
          where,
          ["username", "id", "phone", "nickname", "name"],
          q
        );
        options.where = where;
      }
      if (!options?.order) {
        options.order = {
          created_at: "DESC",
          id: "ASC",
        };
      }
    }
    return super.getList(options);
  }
  async getByPhone(phone: string): Promise<User | null> {
    const find = await this.repository.findOne({ where: { phone } });
    return find;
  }
  async auth(username: string, password: string): Promise<User | null> {
    const find = await this.repository.findOne({
      where: { username },
      withDeleted: true,
    });

    return find &&
      find.password_hash &&
      (await comparePasswords(password, find.password_hash))
      ? find
      : null;
  }

  async create(data: DeepPartial<User & { password?: string }>): Promise<User> {
    if (data?.password) {
      data.password_hash = await hashPassword(data.password);
      delete data.password;
    }
    return super.create(data as DeepPartial<User>);
  }

  async update(
    where: FindOptionsWhere<User> | FindOptionsWhere<User>[],
    data: QueryDeepPartialEntity<User> & { password?: string },
    returnEnttiy?: boolean
  ): Promise<UpdateResult<User>> {
    if (data?.password) {
      data.password_hash = await hashPassword(data.password);
      delete data.password;
    }
    return super.update(where, data, returnEnttiy);
  }
  async getUser(id: string): Promise<User | null> {
    return await this.repository
      .builder("u")
      .leftJoinAndSelect("u.points", "pt")
      .leftJoinAndSelect("u.coupons", "cu")
      .leftJoinAndSelect("u.group", "g")
      .leftJoinAndSelect("u.accounts", "acc")
      .where(`u.id = :id`, { id })
      .andWhere(
        `(pt IS NULL OR ((pt.ends_at IS NULL OR pt.ends_at > NOW()) AND pt.point - pt.used_point > 0))`
      )
      .andWhere(
        `(cu IS NULL OR (cu.item_id IS NULL AND cu.order_id IS NULL AND cu.shipping_method_id IS NULL AND cu.ends_at > NOW()))`
      )
      .getOne();
  }
  async getStorePayment(user_id: string) {
    return (
      (
        await this.repository.query(`
        SELECT 
          SUM(l.sum) 
        FROM 
          public.order o 
          JOIN (
            SELECT 
              l.order_id, 
              SUM(
                round(
                  (
                    l.quantity - COALESCE(ri.quantity, 0)
                  ) * (
                    l.discount_price + COALESCE(l.shared_price,0)
                  )
                )
              ) -- (구매 갯수 - 환불 및 환불 예정 개수) * (단일가(할인된) + 책임금(배송비 - 포인트 - 기타 할인가))
            FROM 
              public.line_item l 
              LEFT JOIN public.refund_item ri ON ri.item_id = l.id 
              AND ri.deleted_at IS NULL 
            WHERE 
              l.confirmation IS TRUE 
              AND l.quantity > COALESCE(ri.quantity, 0) 
              AND l.discount_price + COALESCE(l.shared_price,0) > 0 
            GROUP BY 
              l.order_id
          ) l ON l.order_id = o.id 
        WHERE 
          o.status != 'cancel' -- 주문 취소 여부
          AND o.user_id ='${user_id}'
        GROUP BY 
          o.user_id;
      `)
      )?.[0]?.sum || 0
    );
  }
}
