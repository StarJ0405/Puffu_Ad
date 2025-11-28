import { EventBundle } from "models/bundle";
import { EventBundleService } from "services/bundle";
import { container } from "tsyringe";

export const POST: ApiHandler = async (req, res) => {
  const { id, bundle_id } = req.params;
  const {
    name,
    N,
    M,
    products,
    variants,
    metadata,
    return_data = false,
  } = req.body;

  const service: EventBundleService = container.resolve(EventBundleService);
  try {
    const _data = {
      event_id: id,
      name,
      N,
      M,
      products,
      variants,
      metadata,
    };
    const result: UpdateResult<EventBundle> = await service.update(
      { id: bundle_id },
      _data,
      true
    );
    return res.json(return_data ? { content: result } : { message: "success" });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message, status: 500 });
  }
};

export const DELETE: ApiHandler = async (req, res) => {
  const { bundle_id } = req.params;
  const { soft } = req.parsedQuery;
  const service: EventBundleService = container.resolve(EventBundleService);
  const result = await service.delete(
    {
      id: bundle_id,
    },
    soft
  );
  if (result) {
    return res.json({ message: "sucess" });
  } else {
    return res.status(404).json({ error: "fail" });
  }
};
