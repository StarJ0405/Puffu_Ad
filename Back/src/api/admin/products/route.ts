import { Product } from "models/product";
import { ProductService } from "services/product";
import { container } from "tsyringe";
import { FindOptionsOrder, LessThanOrEqual } from "typeorm";

export const POST: ApiHandler = async (req, res) => {
  const {
    store_id,
    brand_id,
    category_id,
    title,
    thumbnail,
    description,
    detail,
    price,
    tax_rate,
    visible,
    buyable,
    tags,
    adult,
    metadata,
    variants,
    options,
    brand_mode,
    _amount = 1,
    _return_data = false,
  } = req.body;

  const service: ProductService = container.resolve(ProductService);
  try {
    let result: Product[] = [];
    const _data = {
      store_id,
      brand_id,
      category_id,
      title,
      thumbnail,
      description,
      detail,
      price,
      tax_rate,
      visible,
      buyable,
      tags,
      adult,
      metadata,
      variants,
      options,
      brand_mode,
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

  const service: ProductService = container.resolve(ProductService);
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
  order?: FindOptionsOrder<Product>;
}) {
  const service: ProductService = container.resolve(ProductService);
  switch (_type) {
    case "status": {
      const list = await service.getCount();
      const sale = await service.getCount({
        where: {
          buyable: true,
        },
      });
      const min = await service.getCount({
        where: {
          variants: {
            stack: LessThanOrEqual(0),
          },
        },
        relations: ["variants"],
      });
      const hide = await service.getCount({
        where: {
          visible: false,
        },
        relations: ["variants"],
      });
      return { list, sale, min, hide };
    }
  }
  return undefined;
}
