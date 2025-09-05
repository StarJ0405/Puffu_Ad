import { Variant } from "models/variant";
import { VariantService } from "services/variant";
import { container } from "tsyringe";

export const POST: ApiHandler = async (req, res) => {
  const { id } = req.params;
  const {
    product_id,
    title,
    thumbnail,
    extra_price,
    stack,
    visible,
    buyable,
    metadata,
    values,
    return_data = false,
  } = req.body;

  const service: VariantService = container.resolve(VariantService);
  try {
    const _data = {
      product_id,
      title,
      thumbnail,
      extra_price,
      stack,
      visible,
      buyable,
      metadata,
      values,
    };
    const result: UpdateResult<Variant> = await service.update(
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
  const service: VariantService = container.resolve(VariantService);

  const content = await service.getById(id, { select, relations, withDeleted });
  return res.json({ content });
};

export const DELETE: ApiHandler = async (req, res) => {
  const { id } = req.params;
  const { soft } = req.parsedQuery;
  const service: VariantService = container.resolve(VariantService);
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
