import { container } from "tsyringe";
import { IntakeRequestService } from "services/intake_request";

export const GET: ApiHandler = async (req, res) => {
  const svc = container.resolve(IntakeRequestService);
  const {
    pageSize,
    pageNumber = 0,
    q,
    store_id,
    status,
    order,
    relations,
    select,
  } = req.parsedQuery;

  const where = svc.buildWhere(q, store_id, status);

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
  const svc = container.resolve(IntakeRequestService);
  const _data = req.body;
  try {
    const result = await svc.createRequest(_data.store_id, _data.email);
    return res.json(
      _data._return_data ? { content: result } : { message: "success" }
    );
  } catch (e) {
    return res.status(500).json({ message: "error", error: String(e) });
  }
};
