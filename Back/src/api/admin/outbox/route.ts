import { container } from "tsyringe";
import { OutboxService } from "services/outbox";

export const GET: ApiHandler = async (req, res) => {
  const svc = container.resolve(OutboxService);
  const {
    pageSize,
    pageNumber = 0,
    relations,
    order,
    select,
    q,              // payload 검색 시 사용 선택
    endpoint_id,
    event_id,
    status,         // 'pending' | 'sent' | 'failed' 등
    ...others
  } = req.query;

  const where = svc.buildWhere(
    String(q || "") || undefined,
    String(endpoint_id || "") || undefined,
    String(event_id || "") || undefined,
    String(status || "") || undefined
  );

  const base = { where, relations, order, select, whereExtra: others } as any;

  if (pageSize) {
    const page = await svc.getPageable(
      { pageSize: Number(pageSize), pageNumber: Number(pageNumber) },
      base as any
    );
    return res.json(page);
  } else {
    const content = await svc.getList(base as any);
    return res.json({ content });
  }
};

export const POST: ApiHandler = async (req, res) => {
  const svc = container.resolve(OutboxService);
  const created = await svc.create(req.body);
  return res.json(created);
};
