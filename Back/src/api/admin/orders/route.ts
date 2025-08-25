import { ApiHandler } from "app";
import { Order } from "models/order";
import { OrderService } from "services/order";
import { ShippingMethodService } from "services/shipping_method";
import { container } from "tsyringe";
import { In } from "typeorm";

export const POST: ApiHandler = async (req, res) => {
  const { metadata, _amount = 1, _return_data = false } = req.body;

  const service: OrderService = container.resolve(OrderService);
  try {
    let result: Order[] = [];
    const _data = {
      metadata,
    };
    if (_amount === 1) {
      result = [await service.create(_data)];
    } else {
      result = await service.creates(_data, _amount);
    }
    return res.json(
      _return_data ? { content: result } : { message: "success" }
    );
  } catch (err: any) {
    return res.status(500).json({ error: err?.message, status: 500 });
  }
};

export const GET: ApiHandler = async (req, res) => {
  let {
    pageSize,
    pageNumber = 0,
    relations,
    order,
    select,
    ...where
  } = req.parsedQuery;
  const service: OrderService = container.resolve(OrderService);
  if (pageSize) {
    const page = await service.getPageable(
      {
        pageSize: Number(pageSize),
        pageNumber: Number(pageNumber),
      },
      { select, order, relations, where }
    );
    return res.json(page);
  } else {
    const content = await service.getList({ select, order, relations, where });
    return res.json({ content });
  }
};

export const PUT: ApiHandler = async (req, res) => {
  const bodies = Array.isArray(req.body) ? req.body : [req.body];
  const service = container.resolve(OrderService);
  try {
    await Promise.all(
      bodies.map(async (body) => {
        const { id, display, tracking_number, ...update } = body;
        if (update && Object.keys(update)?.length > 0) {
          if (id)
            await service.update(
              {
                id: Array.isArray(id) ? In(id) : id,
              },
              update
            );
          if (display)
            await service.update(
              {
                display: Array.isArray(display) ? In(display) : display,
              },
              update
            );
        }
        if (tracking_number) {
          if (id)
            await service.updateTrackingNumber(
              {
                id: Array.isArray(id) ? In(id) : id,
              },

              tracking_number
            );
          if (display) {
            await service.updateTrackingNumber(
              {
                display: Array.isArray(display) ? In(display) : display,
              },
              tracking_number
            );
          }
        }
      })
    );
    return res.json({ message: "success" });
  } catch (err) {
    console.log(err);
    return res.status(404).json({ error: err });
  }
};
