import { Exchange } from "models/exchange";
import { ExchangeService } from "services/exchange";
import { container } from "tsyringe";

export const POST: ApiHandler = async (req, res) => {
  const { id } = req.params;
  const {
    order_id,
    // value,
    // point,
    completed_at,
    // canceled_at,
    // data,
    tracking_number,
    metadata,
    items,
    return_data = false,
  } = req.body;

  const service: ExchangeService = container.resolve(ExchangeService);
  try {
    const _data = {
      order_id,
      // value,
      // point,
      completed_at,
      // canceled_at,
      // data,
      tracking_number,
      metadata,
      items,
    };
    const result: UpdateResult<Exchange> = await service.update(
      { id: id },
      _data,
      true
    );
    return res.json(return_data ? { content: result } : { message: "success" });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message, status: 500 });
  }
};
export const GET: ApiHandler = async (req, res) => {
  const { id } = req.params;
  const { select, relations, withDeleted } = req.parsedQuery;
  const service: ExchangeService = container.resolve(ExchangeService);

  const content = await service.getById(id, { select, relations, withDeleted });
  return res.json({ content });
};

export const DELETE: ApiHandler = async (req, res) => {
  const { id } = req.params;
  const service: ExchangeService = container.resolve(ExchangeService);
  const result = await service.delete({
    id,
  });
  if (result) {
    return res.json({ message: "sucess" });
  } else {
    return res.status(404).json({ error: "fail" });
  }
};
