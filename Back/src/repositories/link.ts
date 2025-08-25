import { BaseRepository } from "data-source";
import { Link } from "models/link";
import { inject, injectable } from "tsyringe";
import { EntityManager } from "typeorm";

@injectable()
export class LinkRepository extends BaseRepository<Link> {
  constructor(@inject("dataSource") public readonly manager: EntityManager) {
    super(manager, Link);
  }
}
