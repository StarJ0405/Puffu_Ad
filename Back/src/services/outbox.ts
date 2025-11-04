import { inject, injectable } from "tsyringe";
import { BaseService } from "data-source";
import { OutboxRepository } from "repositories/outbox";
import { Outbox } from "models/outbox";

@injectable()
export class OutboxService extends BaseService<Outbox, OutboxRepository> {
  constructor(@inject(OutboxRepository) repo: OutboxRepository) {
    super(repo);
  }

  buildWhere(q?: string, store_id?: string, endpoint_id?: string, status?: string) {
    let where: any = {};
    if (q) where = this.Search(where, ["event_id", "event_type"], q);
    if (store_id) where.store_id = store_id;
    if (endpoint_id) where.endpoint_id = endpoint_id;
    if (status) where.status = status;
    return where;
  }

  // 성공 처리
  async markSuccess(id: string, response: Record<string, unknown>) {
    await this.update(
      { id },
      {
        status: "success",
        response,
        sent_at: new Date(),
      } as any
    );
    return await this.getById(id);
  }

  // 실패 처리
  async markFailed(id: string, response?: Record<string, unknown>) {
    const outbox = await this.getById(id);
    if (!outbox) throw new Error("outbox_not_found");
    await this.update(
      { id },
      {
        status: "failed",
        attempts: (outbox.attempts || 0) + 1,
        response,
      } as any
    );
    return await this.getById(id);
  }

  // 재시도 큐 조회
  async getRetryTargets(limit = 50) {
    return await this.repository.findAll({
      where: { status: "failed" },
      order: { updated_at: "ASC" },
      take: limit,
    });
  }
}
