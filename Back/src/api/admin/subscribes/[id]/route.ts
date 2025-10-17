import { Subscribe } from "models/subscribe";
import { SubscribeService } from "services/subscribe";
import { container } from "tsyringe";

export const POST: ApiHandler = async (req, res) => {
  const { id } = req.params;
  const {
    store_id,
    name,
    price,
    percent,
    value,
    metadata,
    return_data = false,
  } = req.body;

  const service: SubscribeService = container.resolve(SubscribeService);
  try {
    const _data = {
      store_id,
      name,
      price,
      percent,
      value,
      metadata,
    };
    const result: UpdateResult<Subscribe> = await service.update(
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
  const service: SubscribeService = container.resolve(SubscribeService);

  const content = await service.getById(id, { select, relations, withDeleted });
  return res.json({ content });
};

export const DELETE: ApiHandler = async (req, res) => {
  const { id } = req.params;
  const { soft } = req.parsedQuery;
  const service: SubscribeService = container.resolve(SubscribeService);
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
