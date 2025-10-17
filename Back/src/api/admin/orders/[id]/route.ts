import { Order } from "models/order";
import { OrderService } from "services/order";
import { ShippingMethodService } from "services/shipping_method";
import { container } from "tsyringe";

export const POST: ApiHandler = async (req, res) => {
  const { id } = req.params;
  const { metadata, tracking_number, return_data = false, status } = req.body;

  const service: OrderService = container.resolve(OrderService);
  const shippingService = container.resolve(ShippingMethodService);
  try {
    const _data = {
      metadata,
      status,
    };
    if ("tracking_number" in req.body) {
      shippingService.update({ order_id: id }, { tracking_number });
    }
    const result: UpdateResult<Order> = await service.update(
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
  const service: OrderService = container.resolve(OrderService);

  const content = await service.getById(id, { select, relations, withDeleted });
  return res.json({ content });
};

export const DELETE: ApiHandler = async (req, res) => {
  const { id } = req.params;
  const { soft } = req.parsedQuery;
  const service: OrderService = container.resolve(OrderService);
  const result = await service.delete(
    {
      id,
    },
    soft
  );
  if (result) {
    return res.json({ message: "sucess" });
  } else {
    return res.status(404).json({ error: "fail" });
  }
};
