import { container } from "tsyringe";
import { TagMapService } from "services/tag_map";

export const GET: ApiHandler = async (req, res) => {
  const svc = container.resolve(TagMapService);
  const {
    pageSize,
    pageNumber = 0,
    relations,
    order,
    select,
    contract_id,
    tag,
    ...others
  } = req.query;

  const where = svc.buildWhere(
    String(contract_id || "") || undefined,
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
  const svc = container.resolve(TagMapService);
  const created = await svc.create(req.body); // { contract_id, tag }
  return res.json(created);
};
