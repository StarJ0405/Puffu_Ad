import { Product } from "models/product";
import { ProductService } from "services/product";
import { container } from "tsyringe";

export const POST: ApiHandler = async (req, res) => {
  const { id } = req.params;
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
    tags,
    adult,
    metadata,
    variants,
    options,
    brand_mode,
    return_data = false,
  } = req.body;

  const service: ProductService = container.resolve(ProductService);
  try {
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
      tags,
      adult,
      metadata,
      variants,
      options,
      brand_mode,
    };
    const result: UpdateResult<Product> = await service.update(
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
  const service: ProductService = container.resolve(ProductService);

  const content = await service.getById(id, { select, relations, withDeleted });
  return res.json({ content });
};

export const DELETE: ApiHandler = async (req, res) => {
  const { id } = req.params;
  const { soft } = req.parsedQuery;
  const service: ProductService = container.resolve(ProductService);
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

export const PUT: ApiHandler = async (req, res) => {
  const { id } = req.params;
  const { type, before, options, title, thumbnail } = req.body;

  const service: ProductService = container.resolve(ProductService);
  try {
    await service.changeType(id, type, before, { options, title, thumbnail });
    return res.json({ message: "success" });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message, status: 500 });
  }
};
