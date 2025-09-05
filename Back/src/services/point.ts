import { BaseService } from "data-source";
import { Point } from "models/point";
import { LogRepository } from "repositories/log";
import { PointRepository } from "repositories/point";

import { inject, injectable } from "tsyringe";

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
  async usePoint(user_id: string, point: number) {
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
    await this.logRepository.create({
      type: "point",
      name: `상품 구매`,
      data: {
        point: -point,
        user_id,
      },
    });
  }
}
