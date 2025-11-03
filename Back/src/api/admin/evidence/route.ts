import { container } from "tsyringe";
import { EvidenceService } from "services/evidence";

export const GET: ApiHandler = async (req, res) => {
  const svc = container.resolve(EvidenceService);
  const {
    pageSize,
    pageNumber = 0,
    relations,
    order,
    select,
    q,
    contract_id,
    file_bucket,
    file_key,
    ...others
  } = req.query;

  const where = svc.buildWhere(
    String(contract_id || "") || undefined,
    String(file_bucket || "") || undefined,
    String(file_key || "") || undefined
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
  const svc = container.resolve(EvidenceService);
  const created = await svc.create(req.body);
  return res.json(created);
};
