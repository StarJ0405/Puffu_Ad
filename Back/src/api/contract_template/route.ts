import { container } from "tsyringe";
import { ContractTemplateService } from "services/contract_template";

export const GET: ApiHandler = async (req, res) => {
  const svc = container.resolve(ContractTemplateService);
  const {
    pageSize,
    pageNumber = 0,
    relations,
    order,
    select,
    q,
    store_id,
    status,
    is_default,
    ...others
  } = req.query;

  const where = svc.buildWhere(
    String(q || "") || undefined,
    String(store_id || "") || undefined,
    String(status || "") || undefined,
    typeof is_default === "string" ? is_default : undefined
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
  const svc = container.resolve(ContractTemplateService);
  const created = await svc.create(req.body);
  return res.json(created);
};
