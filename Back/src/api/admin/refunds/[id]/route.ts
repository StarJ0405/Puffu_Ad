import { Refund } from "models/refund";
import { RefundService } from "services/refund";
import { container } from "tsyringe";

export const POST: ApiHandler = async (req, res) => {
  const { id } = req.params;
  const {
    order_id,
    // value,
    // point,
    // completed_at,
    // canceled_at,
    // data,
    metadata,
    items,
    return_data = false,
  } = req.body;

  const service: RefundService = container.resolve(RefundService);
  try {
    const _data = {
      order_id,
      // value,
      // point,
      // completed_at,
      // canceled_at,
      // data,
      metadata,
      items,
    };
    const result: UpdateResult<Refund> = await service.update(
      { id: id },
      _data,
      true
    );
    return res.json(return_data ? { content: result } : { message: "success" });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message, status: 500 });
  }
};
export const PUT: ApiHandler = async (req, res) => {
  const { id } = req.params;
  const { point, value } = req.body;
  const service: RefundService = container.resolve(RefundService);
  await service.refund(id, { point, value });
  return res.json({ message: "success" });
};

export const GET: ApiHandler = async (req, res) => {
  const { id } = req.params;
  const { select, relations, withDeleted } = req.parsedQuery;
  const service: RefundService = container.resolve(RefundService);

  const content = await service.getById(id, { select, relations, withDeleted });
  return res.json({ content });
};

export const DELETE: ApiHandler = async (req, res) => {
  const { id } = req.params;
  const service: RefundService = container.resolve(RefundService);
  const result = await service.delete({
    id,
  });
  if (result) {
    return res.json({ message: "sucess" });
  } else {
    return res.status(404).json({ error: "fail" });
  }
};
