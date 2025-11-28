import { SubscribeService } from "services/subscribe";
import { container } from "tsyringe";

export const DELETE: ApiHandler = async (req, res) => {
  const { id, subscribe_id } = req.params;
  let { refund } = req.parsedQuery;
  const service: SubscribeService = container.resolve(SubscribeService);
  await service.refund(subscribe_id, id, refund);
  return res.json({ message: "success" });
};
