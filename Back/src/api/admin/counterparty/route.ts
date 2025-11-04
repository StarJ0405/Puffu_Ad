import { container } from "tsyringe";
import { CounterpartyService } from "services/counterparty";

export const GET: ApiHandler = async (req, res) => {
  const svc = container.resolve(CounterpartyService);
  const {
    pageSize,
    pageNumber = 0,
    relations,
    order,
    select,
    q,
    status,
    store_id,
    tag,
    ...others
  } = req.parsedQuery;

  const where = svc.buildWhere(
    String(q || "") || undefined,
    String(status || "") || undefined,
    String(store_id || "") || undefined,
    String(tag || "") || undefined
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
  const svc = container.resolve(CounterpartyService);
  const {
    store_id,
    name,
    email,
    phone,
    biz_no,
    channel,
    bank,
    bank_account,
    status,
    tags,
    metadata,
    _return_data = false,
  } = req.body;

  const _data = {
    store_id,
    name,
    email,
    phone,
    biz_no,
    channel,
    bank,
    bank_account,
    status,
    tags,
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
