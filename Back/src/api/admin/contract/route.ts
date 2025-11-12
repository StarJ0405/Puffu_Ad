import { container } from "tsyringe";
import { ContractService } from "services/contract";
import { IsNull, Like } from "typeorm";

export const GET: ApiHandler = async (req, res) => {
  const svc = container.resolve(ContractService);
  const {
    origin_id,
    q,
    pageSize,
    pageNumber = 0,
    order,
    select,
    relations,
    ...others
  } = req.parsedQuery;

  const where: any = {};
  if (origin_id === null || origin_id === "null") where.origin_id = IsNull();
  else if (origin_id) where.origin_id = origin_id;
  if (q) where.name = Like(`%${q}%`);

  const base = { select, order, relations, where, whereExtra: others } as any;

  if (pageSize) {
    const page = await svc.getPageable(
      {
        pageSize: Number(pageSize),
        pageNumber: Number(pageNumber),
      },
      base
    );
    return res.json(page);
  } else {
    const list = await svc.getList(base);
    return res.json(list);
  }
};

export const POST: ApiHandler = async (req, res) => {
  const svc = container.resolve(ContractService);
  const payload = req.body;
  const data = await svc.createTemplate(payload);
  return res.json(data);
};
