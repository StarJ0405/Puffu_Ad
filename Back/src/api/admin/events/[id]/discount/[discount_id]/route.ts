import { EventDiscount } from "models/discount";
import { EventDiscountService } from "services/discount";
import { container } from "tsyringe";

export const POST: ApiHandler = async (req, res) => {
  const { id, discount_id } = req.params;
  const {
    name,
    value,
    products,
    variants,
    metadata,
    return_data = false,
  } = req.body;

  const service: EventDiscountService = container.resolve(EventDiscountService);
  try {
    const _data = {
      event_id: id,
      name,
      value,
      products,
      variants,
      metadata,
    };
    const result: UpdateResult<EventDiscount> = await service.update(
      { id: discount_id },
      _data,
      true
    );
    return res.json(return_data ? { content: result } : { message: "success" });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message, status: 500 });
  }
};

export const DELETE: ApiHandler = async (req, res) => {
  const { discount_id } = req.params;
  const { soft } = req.parsedQuery;
  const service: EventDiscountService = container.resolve(EventDiscountService);
  const result = await service.delete(
    {
      id: discount_id,
    },
    soft
  );
  if (result) {
    return res.json({ message: "sucess" });
  } else {
    return res.status(404).json({ error: "fail" });
  }
};
