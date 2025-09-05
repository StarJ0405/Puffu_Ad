import { OrderService } from "services/order";
import { container } from "tsyringe";

export const GET: ApiHandler = async (req, res) => {
  const user = req.user;

  const service: OrderService = container.resolve(OrderService);
  return res.json({ content: await service.getStatus(user.id) });
};
