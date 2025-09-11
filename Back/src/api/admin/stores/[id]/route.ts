import { Store } from "models/store";
import { StoreService } from "services/store";
import { container } from "tsyringe";

export const POST: ApiHandler = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    thumbnail,
    logo,
    description,
    currency_unit,
    adult,
    metadata,
    index,
    subdomain,
    return_data = false,
  } = req.body;

  const service: StoreService = container.resolve(StoreService);
  try {
    const _data = {
      name,
      thumbnail,
      logo,
      description,
      currency_unit,
      adult,
      metadata,
      index,
      subdomain,
    };
    const result: UpdateResult<Store> = await service.update(
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
  const service: StoreService = container.resolve(StoreService);

  const content = await service.getById(id, { select, withDeleted, relations });
  return res.json({ content });
};

export const DELETE: ApiHandler = async (req, res) => {
  const { id } = req.params;
  const { soft } = req.parsedQuery;
  const service: StoreService = container.resolve(StoreService);
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
