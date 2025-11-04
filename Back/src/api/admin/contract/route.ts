import { container } from "tsyringe";
import { ContractService } from "services/contract";

export const GET: ApiHandler = async (req, res) => {
  const svc = container.resolve(ContractService);
  const {
    pageSize,
    pageNumber = 0,
    q,
    store_id,
    counterparty_id,
    tag,
    order,
    relations,
    select,
  } = req.parsedQuery;

  const where = svc.buildWhere(q, store_id, counterparty_id, tag);
  const base = { where, order, relations, select } as any;

  try {
    if (pageSize) {
      const page = await svc.getPageable(
        { pageSize: Number(pageSize), pageNumber: Number(pageNumber) },
        base
      );
      return res.json(page);
    } else {
      const list = await svc.getList(base);
      return res.json(list);
    }
  } catch (e) {
    return res.status(500).json({ message: "error", error: String(e) });
  }
};

export const POST: ApiHandler = async (req, res) => {
  const svc = container.resolve(ContractService);
  const { contractData, versionBody, _return_data } = req.body;

  try {
    const result = await svc.createWithVersionAndSnapshot(
      contractData,
      versionBody
    );
    return res.json(
      _return_data ? { content: result } : { message: "success" }
    );
  } catch (e) {
    return res.status(500).json({ message: "error", error: String(e) });
  }
};
