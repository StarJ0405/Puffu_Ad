import { container } from "tsyringe";
import { ContractVersionService } from "services/contract_version";

export const GET: ApiHandler = async (req, res) => {
  const svc = container.resolve(ContractVersionService);
  const {
    pageSize,
    pageNumber = 0,
    relations,
    order,
    select,
    q,
    contract_id,
    v_no,
    locked,
    created_gte,
    created_lte,
    ...others
  } = req.query;

  const where = svc.buildWhere(
    String(q || "") || undefined,
    String(contract_id || "") || undefined,
    v_no !== undefined ? String(v_no) : undefined,
    locked !== undefined ? String(locked) : undefined,
    String(created_gte || "") || undefined,
    String(created_lte || "") || undefined
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
  const svc = container.resolve(ContractVersionService);
  const created = await svc.create(req.body);
  return res.json(created);
};
