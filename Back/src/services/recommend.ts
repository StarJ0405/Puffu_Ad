import { BaseService } from "data-source";
import { Recommend } from "models/recommend";
import { RecommendRepository } from "repositories/recommend";
import { inject, injectable } from "tsyringe";

@injectable()
export class RecommendService extends BaseService<Recommend, RecommendRepository> {
  constructor(
    @inject(RecommendRepository) recommendRepository: RecommendRepository
  ) {
    super(recommendRepository);
  }

  async getCounts(ids: string[]): Promise<{ id: string; count: number }[]> {
    if (ids.length === 0) ids.push(`''`);
    return await this.repository
      .builder("rec")
      .select("review_id", "id")
      .addSelect("COUNT(*)", "count")
      // .where(`review_id IN (${ids.map((id) => `'${id}'`).join(",")})`)
      .where("rec.review_id IN (:...ids)", { ids })
      .groupBy("review_id")
      .getRawMany();
  }
}
