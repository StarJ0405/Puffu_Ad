import { BaseService } from "data-source";
import { Recent } from "models/recent";
import { RecentRepository } from "repositories/recent";
import { inject, injectable } from "tsyringe";

@injectable()
export class RecentService extends BaseService<Recent, RecentRepository> {
  constructor(@inject(RecentRepository) recentRepository: RecentRepository) {
    super(recentRepository);
  }
}
