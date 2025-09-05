import { BaseRepository } from "data-source";
import { Point } from "models/point";
import { inject, injectable } from "tsyringe";
import { EntityManager } from "typeorm";

@injectable()
export class PointRepository extends BaseRepository<Point> {
  constructor(@inject("dataSource") public readonly manager: EntityManager) {
    super(manager, Point);
  }
}
