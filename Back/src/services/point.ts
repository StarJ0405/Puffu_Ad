import { BaseService } from "data-source";
import { Log } from "models/log";
import { Point } from "models/point";
import { LogRepository } from "repositories/log";
import { PointRepository } from "repositories/point";

import { inject, injectable } from "tsyringe";
import { FindManyOptions, FindOneOptions } from "typeorm";

@injectable()
export class PointService extends BaseService<Point, PointRepository> {
  constructor(
    @inject(PointRepository) pointRepository: PointRepository,
    @inject(LogRepository) protected logRepository: LogRepository
  ) {
    super(pointRepository);
  }

  async getTotalPoint(user_id: string): Promise<number> {
    return (
      (
        await this.repository
          .builder("pt")
          .select("sum(pt.point - pt.used_point)", "sum")
          .where(`pt.user_id = :user_id`, { user_id })
          .andWhere(`(pt.ends_at IS NULL OR pt.ends_at > NOW())`)
          .groupBy("pt.user_id")
          .getRawOne()
      )?.sum || 0
    );
  }
  async usePoint(user_id: string, point: number, data?: any) {
    const points = await this.repository
      .builder("pt")
      .where(`pt.user_id = :user_id`, { user_id })
      .andWhere(`(pt.ends_at IS NULL OR pt.ends_at > NOW())`)
      .orderBy("created_at", "ASC")
      .getMany();

    let used = point;
    for (const point of points) {
      const remain = point.point - point.used_point;
      if (used > remain) {
        await this.repository.update(
          { id: point.id },
          {
            used_point: point.point,
          }
        );
        used = used - remain;
      } else {
        await this.repository.update(
          { id: point.id },
          {
            used_point: point.used_point + used,
          }
        );
        used = 0;
      }
      if (used <= 0) break;
    }
    if (point > 0) {
      const total = this.getTotalPoint(user_id);
      await this.logRepository.create({
        type: "point",
        name: `상품 구매`,
        data: {
          point: -point,
          user_id,
          total,
          ...data,
        },
      });
    }
  }
  async getPointDates(user_id: string, name?: string) {
    let builder = this.logRepository
      .builder("l")
      .select("EXTRACT(YEAR FROM created_at)", "created_year")
      .addSelect("EXTRACT(MONTH FROM created_at)", "created_month")
      .where(`data->>'user_id' = :user_id`, { user_id })
      .groupBy("created_year")
      .addGroupBy("created_month")
      .orderBy("created_year", "DESC")
      .addOrderBy("created_month", "DESC");
    if (name) {
      builder = builder.andWhere("name ILIKE :name", {
        name: `%${name}%`,
      });
    }

    return await builder.getRawMany();
  }
  async getPointList(options?: FindManyOptions<Log>): Promise<Log[]> {
    const where: any = options?.where;
    let builder = this.logRepository
      .builder("l")
      .where(`data ->> 'user_id' = :user_id`, { user_id: where?.user_id });
    if (where.starts_at && where.ends_at) {
      builder = builder.andWhere(`created_at BETWEEN :starts_at AND :ends_at`, {
        starts_at: new Date(where.starts_at).toISOString(),
        ends_at: new Date(where.ends_at).toISOString(),
      });
    }
    if (where.name) {
      builder = builder.andWhere("name ILIKE :name", {
        name: `%${where.name}%`,
      });
    }
    if (options?.order?.created_at) {
      builder = builder.orderBy(
        "created_at",
        String(options.order.created_at || "asc").toUpperCase() as any
      );
    }

    return await builder.getMany();
  }
  async getPointPageable(pageData: PageData, options: FindOneOptions<Log>) {
    const where: any = options?.where;
    let builder = this.logRepository
      .builder("l")
      .where(`data ->> 'user_id' = :user_id`, { user_id: where?.user_id });
    if (where.starts_at && where.ends_at) {
      builder = builder.andWhere(`created_at BETWEEN :starts_at AND :ends_at`, {
        starts_at: new Date(where.starts_at).toISOString(),
        ends_at: new Date(where.ends_at).toISOString(),
      });
    }
    if (where.name) {
      builder = builder.andWhere("name ILIKE :name", {
        name: `%${where.name}%`,
      });
    }
    if (options?.order?.created_at) {
      builder = builder.orderBy(
        "created_at",
        String(options.order.created_at || "asc").toUpperCase() as any
      );
    }
    const { pageSize, pageNumber = 0 } = pageData;
    const content = await builder
      .clone()
      .skip(pageSize * pageNumber)
      .take(pageSize)
      .getMany();
    const NumberOfTotalElements = await builder.getCount();
    const NumberOfElements = content.length;
    const totalPages =
      pageSize > 0 ? Math.ceil(NumberOfTotalElements / pageSize) : 0;
    const last = pageNumber === totalPages - 1;
    return {
      content,
      pageSize,
      pageNumber,
      NumberOfTotalElements,
      NumberOfElements,
      totalPages,
      last,
    };
  }
}
