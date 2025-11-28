import { Product } from "models/product";
import { ProductService } from "services/product";
import { container } from "tsyringe";
import { FindOptionsOrder, LessThanOrEqual } from "typeorm";

export const POST: ApiHandler = async (req, res) => {
  const {
    store_id,
    brand_id,
    categories,
    title,
    code,
    thumbnail,
    description,
    detail,
    price,
    tax_rate,
    visible,
    buyable,
    warehousing,
    product_type,
    tags,
    adult,
    metadata,
    variants,
    options,
    brand_mode,
    _amount = 1,
    _return_data = false,
  } = req.body;
  const pt = product_type === "null" ? null : product_type;
  const service: ProductService = container.resolve(ProductService);
  try {
    let result: Product[] = [];
    const _data = {
      store_id,
      brand_id,
      categories,
      title,
      code,
      thumbnail,
      description,
      detail,
      price,
      tax_rate,
      visible,
      buyable,
      warehousing,
      product_type: pt,
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

  const b = (v: any) =>
    typeof v === "string" ? v === "true" || v === "1" : !!v;
  if ("warehousing" in where) where.warehousing = b(where.warehousing);

  if ("product_type" in where) {
  if (where.product_type === "null") where.product_type = null;
  else if (where.product_type === "is_set" || where.product_type === "random_box")
    where.product_type = String(where.product_type);
  else delete where.product_type;
}

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
