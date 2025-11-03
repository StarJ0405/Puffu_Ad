import { container } from "tsyringe";
import { ApprovalService } from "services/approval";

export const GET: ApiHandler = async (req, res) => {
  const svc = container.resolve(ApprovalService);
  const {
    pageSize,
    pageNumber = 0,
    relations,
    order,
    select,
    q,
    contract_id,
    approver_id,
    status,
    ...others
  } = req.query;

  const where = svc.buildWhere(
    String(contract_id || "") || undefined,
    String(approver_id || "") || undefined,
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
  const svc = container.resolve(ApprovalService);
  const created = await svc.create(req.body);
  return res.json(created);
};
