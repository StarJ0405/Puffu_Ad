import { ApiHandler } from "app";
import { OrderService } from "services/order";
import { container } from "tsyringe";

export const GET: ApiHandler = async (req, res) => {
  const user = req.user;
  const { id } = req.params;
  const { select, relations, withDeleted } = req.parsedQuery;
  const service: OrderService = container.resolve(OrderService);

  let content = await service.getById(id, { select, relations, withDeleted });
  if (content?.user_id !== user.id) content = null;
  return res.json({ content });
};
