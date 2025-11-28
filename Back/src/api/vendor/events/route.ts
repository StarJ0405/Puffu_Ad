import { Event } from "models/event";
import { EventService } from "services/event";
import { container } from "tsyringe";

export const POST: ApiHandler = async (req, res) => {
  const {
    store_id,
    title,
    starts_at,
    ends_at,
    discounts,
    bundles,
    metadata,
    _amount = 1,
    _return_data = false,
  } = req.body;

  const service: EventService = container.resolve(EventService);
  try {
    let result: Event[] = [];
    const _data = {
      store_id,
      title,
      starts_at,
      ends_at,
      discounts,
      bundles,
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
    _type,
    pageSize,
    pageNumber = 0,
    relations,
    order,
    select,
    ...where
  } = req.parsedQuery;

  const service: EventService = container.resolve(EventService);
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
