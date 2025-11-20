import { container } from "tsyringe";
import { ContractService } from "services/contract";
import { IsNull, Not, In } from "typeorm";

export const GET: ApiHandler = async (req, res) => {
  const svc = container.resolve(ContractService);

  const {
    origin_id,
    origin_id__not,
    q,
    pageSize,
    pageNumber = 0,
    order,
    select,
    relations,
    ...where
  } = req.parsedQuery;

  // origin_id 처리
  if (origin_id__not !== undefined) {
    where.origin_id = Not(IsNull());
  } else if (origin_id === null || origin_id === "null") {
    where.origin_id = IsNull();
  } else if (origin_id) {
    where.origin_id = origin_id;
  }

  // 상태 필터 처리
  if (where.completed_at__not !== undefined) {
    where.completed_at = Not(IsNull());
    delete where.completed_at__not;
  }

  if (where.is_delete__not !== undefined) {
    where.is_delete = Not(IsNull());
    delete where.is_delete__not;
  }

  if (q && String(q).trim() !== "") {
    const contractIds = await svc.searchIdsByQuery(String(q));

    if (contractIds.length === 0) {
      return res.json({
        content: [],
        total: 0,
        pageNumber,
        pageSize,
      });
    }

    where.id = In(contractIds);
  }

  const base = {
    select,
    order,
    relations,
    where,
  } as any;

  if (pageSize) {
    const page = await svc.getPageable(
      { pageSize: Number(pageSize), pageNumber: Number(pageNumber) },
      base
    );
    return res.json(page);
  }

  const list = await svc.getList(base);
  return res.json(list);
};

export const POST: ApiHandler = async (req, res) => {
  const svc = container.resolve(ContractService);
  const payload = req.body;
  const data = await svc.createTemplate(payload);
  return res.json(data);
};
