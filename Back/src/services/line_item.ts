import { BaseService } from "data-source";
import { LineItem } from "models/line_item";
import { LineItemRepository } from "repositories/line_item";
import { PointRepository } from "repositories/point";
import { inject, injectable } from "tsyringe";
import { FindManyOptions, FindOneOptions } from "typeorm";
import { GroupService } from "./group";

@injectable()
export class LineItemService extends BaseService<LineItem, LineItemRepository> {
  constructor(
    @inject(LineItemRepository) lineitemRepository: LineItemRepository,
    @inject(PointRepository) protected pointRepository: PointRepository,
    @inject(GroupService) protected groupService: GroupService
  ) {
    super(lineitemRepository);
  }
  async getPageable(
    pageData: PageData,
    options: FindOneOptions<LineItem>
  ): Promise<Pageable<LineItem>> {
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
  async getList(options?: FindManyOptions<LineItem>): Promise<LineItem[]> {
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
  async confirmation(item_id: string) {
    await this.update(
      {
        id: item_id,
      },
      {
        confirmation: true,
      }
    );
    const point = await this.repository.query(`
      SELECT 
        u.id, 
        ROUND(
          (
            l.discount_price + l.shared_price
          ) * l.quantity * g.percent / 100.0
        )
      FROM 
        public.line_item l 
        JOIN public.order o ON o.id = l.order_id 
        JOIN public.shipping_method sm ON sm.order_id = o.id 
        JOIN public.user u ON u.id = o.user_id 
        JOIN public.group g ON g.id = u.group_id 
      WHERE 
        l.id = '${item_id}'
      `);
    if (point?.length === 1) {
      if (point?.[0].round > 0)
        await this.pointRepository.create({
          user_id: point?.[0].id,
          point: point?.[0].round,
        });
      if (point?.[0]?.id)
        await this.groupService.updateUserGroup(point?.[0]?.id);
    }
  }
  async confirmations() {
    const points: { id: string; round: number }[] = await this.repository
      .query(`
        SELECT 
          u.id, 
          ROUND(uc.sum * g.percent / 100.0) 
        FROM 
          public.user u 
          JOIN (
            SELECT 
              o.user_id, 
              SUM(
                (
                  l.discount_price + l.shared_price
                ) * l.quantity
              ) 
            FROM 
              public.line_item l 
              JOIN public.order o ON o.id = l.order_id 
              JOIN public.shipping_method sm ON sm.order_id = o.id 
            WHERE 
              l.confirmation IS FALSE 
              AND sm.shipped_at <= NOW() - INTERVAL '7 days' 
            GROUP BY 
              o.user_id
          ) uc ON uc.user_id = u.id 
          JOIN public.group g ON g.id = u.group_id;
      `);
    if (points.length === 0) return;
    await this.repository.query(`
        UPDATE
          public.line_item ll
        SET
          confirmation = true
        WHERE
          ll.id in (
            SELECT
              l.id
            FROM
              public.line_item l
              JOIN public.order o ON o.id = l.order_id
              JOIN public.shipping_method sm ON sm.order_id = o.id
            WHERE
              l.confirmation IS FALSE
              AND sm.shipped_at <= NOW() - INTERVAL '7 days'
          );
        `);
    await Promise.all(
      points.map(
        async (point) =>
          point.round > 0 &&
          (await this.pointRepository.create({
            user_id: point.id,
            point: point.round,
          }))
      )
    );
    await this.groupService.updateUserGroups();
  }
}
