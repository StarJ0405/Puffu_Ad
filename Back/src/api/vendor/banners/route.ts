import { Banner } from "models/banner";
import { BannerService } from "services/banner";
import { container } from "tsyringe";

export const POST: ApiHandler = async (req, res) => {
  const {
    name,
    store_id,
    thumbnail,
    to,
    starts_at,
    ends_at,
    adult,
    visible,
    importance,
    metadata,
    _amount = 1,
    _return_data = false,
  } = req.body;

  const service: BannerService = container.resolve(BannerService);
  try {
    let result: Banner[] = [];
    const _data = {
      name,
      store_id,
      thumbnail,
      to,
      starts_at,
      ends_at,
      adult,
      visible,
      importance,
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
  const service: BannerService = container.resolve(BannerService);
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
