import { BaseService } from "data-source";
import { Group } from "models/group";
import { GroupRepository } from "repositories/group";
import { UserRepository } from "repositories/user";
import { inject, injectable } from "tsyringe";
import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
} from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

@injectable()
export class GroupService extends BaseService<Group, GroupRepository> {
  constructor(
    @inject(GroupRepository) groupRepository: GroupRepository,
    @inject(UserRepository) protected userRepository: UserRepository
  ) {
    super(groupRepository);
  }

  async create(data: DeepPartial<Group>): Promise<Group> {
    const result = await super.create(data);
    await this.updateUserGroups();
    return result;
  }
  async creates(data: DeepPartial<Group>, amount: number): Promise<Group[]> {
    const result = await super.creates(data, amount);
    await this.updateUserGroups();
    return result;
  }

  async getPageable(
    pageData: PageData,
    options: FindOneOptions<Group>
  ): Promise<Pageable<Group>> {
    if (options) {
      let where: any = options.where;
      if (where.q) {
        const q = where.q;
        delete where.q;
        where = this.Search(where, ["name", "id"], q);
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
  async getList(options?: FindManyOptions<Group>): Promise<Group[]> {
    if (options) {
      let where: any = options.where;
      if (where.q) {
        const q = where.q;
        delete where.q;
        where = this.Search(where, ["name", "id"], q);
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

  async update(
    where: FindOptionsWhere<Group> | FindOptionsWhere<Group>[],
    data: QueryDeepPartialEntity<Group>,
    returnEnttiy?: boolean
  ): Promise<UpdateResult<Group>> {
    const result = await super.update(where, data, returnEnttiy);
    await this.updateUserGroups();
    return result;
  }
  async updateUserGroups() {
    return await this.repository.query(`
      UPDATE 
        public.user uu 
      set 
        group_id = (
          SELECT 
            g.id 
          FROM 
            (
              SELECT 
                * 
              FROM 
                public.user u 
                LEFT JOIN (
                  SELECT 
                    o.user_id, 
                    SUM(l.sum) 
                  FROM 
                    public.order o 
                    JOIN (
                      SELECT 
                        l.order_id, 
                        SUM(
                          l.quantity * l.discount_price
                        ) -- 구매 갯수 * 단일가(할인된) - 총 환불금
                      FROM 
                        public.line_item l 
                      GROUP BY 
                        l.order_id
                    ) l ON l.order_id = o.id 
                  WHERE 
                    o.status != 'cancel' -- 주문 취소 여부
                    AND o.created_at >= NOW() - INTERVAL '3 months' -- 3개월 체크
                  GROUP BY 
                    o.user_id
                ) o ON o.user_id = u.id
            ) u 
            LEFT JOIN LATERAL (
              SELECT 
                * 
              FROM 
                public.group as g 
              WHERE 
                u.sum >= g.min 
                AND g.deleted_at IS NULL 
              ORDER BY 
                g.percent DESC 
              LIMIT 
                1
            ) AS G ON true 
          WHERE 
            u.id = uu.id
        ) 
      `);
  }
  async updateUserGroup(user_id: string) {
    return await this.repository.query(`
      UPDATE 
        public.user uu 
      set   
        group_id = (
          SELECT 
            g.id 
          FROM 
            (
              SELECT 
                * 
              FROM 
                public.user u 
                LEFT JOIN (
                  SELECT 
                    o.user_id, 
                    SUM(l.sum) 
                  FROM 
                    public.order o 
                    JOIN (
                      SELECT 
                        l.order_id, 
                        SUM(
                          l.quantity * l.discount_price
                        ) -- 구매 갯수 * 단일가(할인된) - 총 환불금
                      FROM 
                        public.line_item l 
                      GROUP BY 
                        l.order_id
                    ) l ON l.order_id = o.id 
                  WHERE 
                    o.status != 'cancel' -- 주문 취소 여부
                    AND o.created_at >= NOW() - INTERVAL '3 months' -- 3개월 체크
                  GROUP BY 
                    o.user_id
                ) o ON o.user_id = u.id
            ) u 
            LEFT JOIN LATERAL (
              SELECT 
                * 
              FROM 
                public.group as g 
              WHERE 
                u.sum >= g.min 
                AND g.deleted_at IS NULL 
              ORDER BY 
                g.percent DESC 
              LIMIT 
                1
            ) AS G ON true 
          WHERE 
            u.id = uu.id
        )
        WHERE 
          uu.id = '${user_id}'
      `);
  }
}
