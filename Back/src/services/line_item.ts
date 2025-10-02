import { BaseService } from "data-source";
import { LineItem } from "models/line_item";
import { LineItemRepository } from "repositories/line_item";
import { LogRepository } from "repositories/log";
import { PointRepository } from "repositories/point";
import { inject, injectable } from "tsyringe";
import { FindManyOptions, FindOneOptions } from "typeorm";
import { GroupService } from "./group";

@injectable()
export class LineItemService extends BaseService<LineItem, LineItemRepository> {
  constructor(
    @inject(LineItemRepository) lineitemRepository: LineItemRepository,
    @inject(PointRepository) protected pointRepository: PointRepository,
    @inject(LogRepository) protected logRepository: LogRepository,
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
    const point = await this.repository.query(`
        SELECT 
          u.id, 
          ROUND(
            (
              l.discount_price + COALESCE(l.shared_price,0)
            ) * l.quantity * COALESCE(g.percent,0) / 100.0
          ) 
        FROM 
          public.line_item l 
          JOIN public.order o ON o.id = l.order_id 
          JOIN public.user u ON u.id = o.user_id 
          LEFT JOIN public.group g ON g.id = u.group_id 
          LEFT JOIN (
            SELECT 
              ri.* 
            FROM 
              public.refund_item ri 
              JOIN public.refund f ON f.id = ri.refund_id 
            WHERE 
              f.completed_at IS NULL -- 환불 완료된 경우 진행
              ) ri ON ri.item_id = l.id 
          AND ri.deleted_at IS NULL 
        WHERE 
          l.id = '${item_id}' 
          AND l.confirmation IS FALSE -- 중복 실행시 포인트 안주기 위함,
          AND ri.id is null -- 환불 처리중 혹시라도 실행되면 막기 위함
      `);
    if (point?.length === 1) {
      await this.update(
        {
          id: item_id,
        },
        {
          confirmation: true,
        }
      );
      if (point?.[0].round > 0) {
        await this.pointRepository.create({
          user_id: point?.[0].id,
          point: point?.[0].round,
        });
        const total =
          (
            await this.pointRepository
              .builder("pt")
              .select("sum(pt.point - pt.used_point)", "sum")
              .where(`pt.user_id = :user_id`, { user_id: point?.[0]?.id })
              .andWhere(`(pt.ends_at IS NULL OR pt.ends_at > NOW())`)
              .groupBy("pt.user_id")
              .getRawOne()
          )?.sum || 0;
        await this.logRepository.create({
          type: "point",
          name: "멤버쉽 적립",
          data: {
            user_id: point?.[0].id,
            point: point?.[0].round,
            total,
          },
        });
      }
      if (point?.[0]?.id)
        await this.groupService.updateUserGroup(point?.[0]?.id);
    }
  }
  async confirmations() {
    const points: { id: string; round: number }[] = await this.repository
      .query(`
      SELECT 
        u.id, 
        ROUND(uc.sum * COALESCE(g.percent,0) / 100.0) 
      FROM 
        public.user u 
        JOIN (
          SELECT 
            o.user_id, 
            SUM(
              (
                l.discount_price + COALESCE(l.shared_price,0)
              ) * l.quantity
            ) 
          FROM 
            public.line_item l 
            JOIN public.order o ON o.id = l.order_id 
            JOIN public.shipping_method sm ON sm.order_id = o.id 
            LEFT JOIN (
              SELECT 
                ri.* 
              FROM 
                public.refund_item ri 
                JOIN public.refund f ON f.id = ri.refund_id 
              WHERE 
                f.completed_at IS NULL -- 환불 완료된 경우 진행
                ) ri ON ri.item_id = l.id 
            AND ri.deleted_at IS NULL 
          WHERE 
            l.confirmation IS FALSE 
            AND ri.id is null 
            AND sm.shipped_at <= NOW() - INTERVAL '7 days' 
          GROUP BY 
            o.user_id
        ) uc ON uc.user_id = u.id 
        LEFT JOIN public.group g ON g.id = u.group_id;
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
              LEFT JOIN (
                SELECT 
                  ri.* 
                FROM 
                  public.refund_item ri 
                  JOIN public.refund f ON f.id = ri.refund_id 
                WHERE 
                  f.completed_at IS NULL -- 환불 완료된 경우 진행
                  ) ri ON ri.item_id = l.id 
              AND ri.deleted_at IS NULL 
            WHERE 
              l.confirmation IS FALSE 
              AND ri.id is null 
              AND sm.shipped_at <= NOW() - INTERVAL '7 days'
          );
        `);
    await Promise.all(
      points.map(async (point) => {
        if (point.round > 0) {
          await this.pointRepository.create({
            user_id: point.id,
            point: point.round,
          });
          const total =
            (
              await this.pointRepository
                .builder("pt")
                .select("sum(pt.point - pt.used_point)", "sum")
                .where(`pt.user_id = :user_id`, { user_id: point?.id })
                .andWhere(`(pt.ends_at IS NULL OR pt.ends_at > NOW())`)
                .groupBy("pt.user_id")
                .getRawOne()
            )?.sum || 0;
          await this.logRepository.create({
            type: "point",
            name: "멤버쉽 적립",
            data: {
              point: point.round,
              user_id: point.id,
              total,
            },
          });
        }
      })
    );
    await this.groupService.updateUserGroups();
  }
}
