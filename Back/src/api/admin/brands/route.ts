import { Brand } from "models/brand";
import { BrandService } from "services/brand";
import { container } from "tsyringe";

export const POST: ApiHandler = async (req, res) => {
  const {
    name,
    thumbnail,
    description,
    metadata,
    _amount = 1,
    _return_data = false,
  } = req.body;

  const service: BrandService = container.resolve(BrandService);
  try {
    let result: Brand[] = [];
    const _data = {
      name,
      thumbnail,
      description,
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
  const service: BrandService = container.resolve(BrandService);
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
