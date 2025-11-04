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
    store_id,
    contract_id,
    ...others
  } = req.parsedQuery;

  const where = svc.buildWhere(
    String(q || "") || undefined,
    String(store_id || "") || undefined,
    String(contract_id || "") || undefined
  );
  const base = { where, relations, order, select, whereExtra: others } as any;

  try {
    if (pageSize) {
      const page = await svc.getPageable(
        { pageSize: Number(pageSize), pageNumber: Number(pageNumber) },
        base
      );
      return res.json(page);
    } else {
      const content = await svc.getList(base);
      return res.json({ content });
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "internal_error" });
  }
};

export const POST: ApiHandler = async (req, res) => {
  const svc = container.resolve(CounterpartySnapshotService);
  const {
    store_id,
    source_id,
    contract_id,
    name,
    email,
    phone,
    biz_no,
    channel,
    bank,
    bank_account,
    metadata,
    _return_data = false,
  } = req.body;

  const _data = {
    store_id,
    source_id,
    contract_id,
    name,
    email,
    phone,
    biz_no,
    channel,
    bank,
    bank_account,
    metadata,
  };

  try {
    const result = await svc.create(_data);
    if (_return_data) return res.json({ content: result });
    return res.json({ message: "success" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "create_failed" });
  }
};
