import { ApiHandler } from "app";
import { Option } from "models/option";
import { OptionService } from "services/option";
import { container } from "tsyringe";

export const POST: ApiHandler = async (req, res) => {
  const {
    product_id,
    title,
    metadata,
    values,
    _amount = 1,
    _return_data = false,
  } = req.body;

  const service: OptionService = container.resolve(OptionService);
  try {
    let result: Option[] = [];
    const _data = {
      product_id,
      title,
      metadata,
      values,
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

  const service: OptionService = container.resolve(OptionService);
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
