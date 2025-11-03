import { container } from "tsyringe";
import { CounterpartySnapshotService } from "services/counterparty_snapshot";

export const GET: ApiHandler = async (req, res) => {
  const svc = container.resolve(CounterpartySnapshotService);
  const {
    pageSize,
    pageNumber = 0,
    relations,
    order,
    select,
    q,
    status,
    store_id,
    counterparty_id,
    tag,
    ...others
  } = req.query;

  const where = svc.buildWhere(
    String(q || "") || undefined,
    String(status || "") || undefined,
    String(store_id || "") || undefined,
    String(counterparty_id || "") || undefined,
    String(tag || "") || undefined
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
  const svc = container.resolve(CounterpartySnapshotService);
  const created = await svc.create(req.body);
  return res.json(created);
};
