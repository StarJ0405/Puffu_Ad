import { ShippingMethod } from "models/shipping_method";
import { ShippingMethodService } from "services/shipping_method";
import { container } from "tsyringe";

export const POST: ApiHandler = async (req, res) => {
  const { id } = req.params;
  const {
    store_id,
    brand_id,
    order_id,
    name,
    amount,
    min,
    max,
    description,
    type,
    metadata,
    return_data = false,
  } = req.body;

  const service: ShippingMethodService = container.resolve(
    ShippingMethodService
  );
  try {
    const _data = {
      store_id,
      brand_id,
      order_id,
      name,
      amount,
      min,
      max,
      description,
      type,
      metadata,
    };
    const result: UpdateResult<ShippingMethod> = await service.update(
      { id: id },
      _data,
      return_data
    );
    return res.json(return_data ? { content: result } : { message: "success" });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message, status: 500 });
  }
};

export const GET: ApiHandler = async (req, res) => {
  const { id } = req.params;
  const { select, relations, withDeleted } = req.parsedQuery;
  const service: ShippingMethodService = container.resolve(
    ShippingMethodService
  );

  const content = await service.getById(id, { select, relations, withDeleted });
  return res.json({ content });
};

export const DELETE: ApiHandler = async (req, res) => {
  const { id } = req.params;
  const { soft } = req.parsedQuery;
  const service: ShippingMethodService = container.resolve(
    ShippingMethodService
  );
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
