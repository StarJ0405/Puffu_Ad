import { OrderService } from "services/order";
import { RefundService } from "services/refund";
import { container } from "tsyringe";

export const POST: ApiHandler = async (req, res) => {
  const { id } = req.params;
  const orderService = container.resolve(OrderService);
  const { items } = req.body;
  if (!items || items?.length === 0)
    return res.status(404).json({ error: "데이터가 부족합니다" });
  if (
    !(await orderService.isExists({
      where: {
        id,
      },
    }))
  )
    return res.status(404).json({ error: "찾을 수 없습니다." });
  const refundService = container.resolve(RefundService);
  await refundService.create({
    order_id: id,
    items,
  });
  return res.json({ message: "success" });
};
