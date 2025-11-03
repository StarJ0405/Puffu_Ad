import { injectable } from "tsyringe";
import { EntityManager } from "typeorm";
import { BaseRepository, BaseService } from "data-source";
import { WebhookEndpoint } from "models/webhook_endpoint";

@injectable()
export class WebhookEndpointRepository extends BaseRepository<WebhookEndpoint> {
  constructor(manager: EntityManager) {
    super(manager, WebhookEndpoint);
  }
}

@injectable()
export class WebhookEndpointService extends BaseService<
  WebhookEndpoint,
  WebhookEndpointRepository
> {
  constructor(repository: WebhookEndpointRepository) {
    super(repository);
  }

  // q는 url 검색용. name 컬럼이 있으면 "name"도 추가 가능.
  buildWhere(q?: string, store_id?: string, status?: string) {
    const where: any = {};
    if (q) where.url = this.Search({}, "url", q);
    if (store_id) where.store_id = store_id;
    if (status) where.status = status; // 'active' | 'inactive' 등
    return where;
  }
}
