import { LineItemService } from "services/line_item";
import { OrderService } from "services/order";
import { container } from "tsyringe";

export const POST: ApiHandler = async (req, res) => {
  const user = req.user;
  const { id, item_id } = req.params;
  const orderService: OrderService = container.resolve(OrderService);

  const order = await orderService.get({
    where: {
      id,
      user_id: user.id,
    },
  });
  if (!order) return res.status(404).json({ error: "now allowed" });
  const service = container.resolve(LineItemService);
  await service.confirmation(item_id);

  return res.json({ message: "success" });
};
