import { EventBundle } from "models/bundle";
import { EventBundleService } from "services/bundle";
import { container } from "tsyringe";

export const POST: ApiHandler = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    N,
    M,
    products,
    variants,
    metadata,
    _amount = 1,
    _return_data = false,
  } = req.body;

  const service: EventBundleService = container.resolve(EventBundleService);
  try {
    let result: EventBundle[] = [];
    const _data = {
      event_id: id,
      name,
      N,
      M,
      products,
      variants,
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
