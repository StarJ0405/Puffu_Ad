import { container } from "tsyringe";
import { InvitationService } from "services/invitation";

export const GET: ApiHandler = async (req, res) => {
  const svc = container.resolve(InvitationService);
  const {
    pageSize,
    pageNumber = 0,
    q,
    contract_id,
    store_id,
    order,
    relations,
    select,
  } = req.parsedQuery;

  const where = svc.buildWhere(q, contract_id, store_id);
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
  const svc = container.resolve(InvitationService);
  const _data = req.body;
  try {
    const result = await svc.createInvitation(_data);
    return res.json(
      _data._return_data ? { content: result } : { message: "success" }
    );
  } catch (e) {
    return res.status(500).json({ message: "error", error: String(e) });
  }
};
