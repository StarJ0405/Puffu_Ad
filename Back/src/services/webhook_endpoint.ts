import { inject, injectable } from "tsyringe";
import { BaseService } from "data-source";
import { WebhookEndpointRepository } from "repositories/webhook_endpoint";
import { WebhookEndpoint } from "models/webhook_endpoint";

@injectable()
export class WebhookEndpointService extends BaseService<
  WebhookEndpoint,
  WebhookEndpointRepository
> {
  constructor(@inject(WebhookEndpointRepository) repo: WebhookEndpointRepository) {
    super(repo);
  }

  buildWhere(q?: string, store_id?: string, status?: string) {
    let where: any = {};
    if (q) where = this.Search(where, ["url", "secret"], q);
    if (store_id) where.store_id = store_id;
    if (status) where.status = status;
    return where;
  }

  // 비활성화
  async deactivate(id: string) {
    await this.update({ id }, { status: "inactive" });
    return await this.getById(id);
  }

  // 재활성화
  async activate(id: string) {
    await this.update({ id }, { status: "active" });
    return await this.getById(id);
  }
}
