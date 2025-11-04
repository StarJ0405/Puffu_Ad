import { injectable, inject } from "tsyringe";
import { EntityManager } from "typeorm";
import { BaseRepository } from "data-source";
import { WebhookEndpoint } from "models/webhook_endpoint";

@injectable()
export class WebhookEndpointRepository extends BaseRepository<WebhookEndpoint> {
  constructor(@inject("dataSource") manager: EntityManager) {
    super(manager, WebhookEndpoint);
  }
}
