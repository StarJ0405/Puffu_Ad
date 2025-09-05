import { BaseRepository } from "data-source";
import { Review } from "models/review";
import { inject, injectable } from "tsyringe";
import { EntityManager } from "typeorm";

@injectable()
export class ReviewRepository extends BaseRepository<Review> {
  constructor(@inject("dataSource") public readonly manager: EntityManager) {
    super(manager, Review);
  }
}
