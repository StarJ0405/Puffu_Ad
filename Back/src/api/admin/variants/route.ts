import { Variant } from "models/variant";
import { VariantService } from "services/variant";
import { container } from "tsyringe";
import { Between, FindOptionsOrder, LessThanOrEqual } from "typeorm";

export const POST: ApiHandler = async (req, res) => {
  const {
    product_id,
    title,
    code,
    thumbnail,
    extra_price,
    stack,
    visible,
    buyable,
    metadata,
    values,
    _amount = 1,
    _return_data = false,
  } = req.body;

  const service: VariantService = container.resolve(VariantService);
  try {
    let result: Variant[] = [];
    const _data = {
      product_id,
      title,
      code,
      thumbnail,
      extra_price,
      stack,
      visible,
      buyable,
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
    _type,
    pageSize,
    pageNumber = 0,
    relations,
    order,
    select,
    ...where
  } = req.parsedQuery;

  if (_type) {
    try {
      const result = await getEtc({ _type, pageSize, pageNumber, order });
      if (result) return res.json({ content: result });
    } catch (err) {
      return res.status(404).json({ error: err, status: 404 });
    }
  }

  const service: VariantService = container.resolve(VariantService);
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
async function getEtc({
  _type,
  pageSize,
  pageNumber,
  order,
}: {
  _type: string;
  pageSize: any;
  pageNumber: any;
  order?: FindOptionsOrder<Variant>;
}) {
  const service: VariantService = container.resolve(VariantService);
  switch (_type) {
    case "outOfStock": {
      const page = await service.getPageable(
        { pageSize, pageNumber },
        {
          where: {
            stack: LessThanOrEqual(0),
          },
          relations: ["product"],
          order,
        }
      );
      return page;
    }
    case "almostOutOfStock": {
      const page = await service.getPageable(
        { pageSize, pageNumber },
        {
          where: {
            stack: Between(1, 100),
          },
          relations: ["product"],
          order,
        }
      );
      return page;
    }
  }
  return undefined;
}
