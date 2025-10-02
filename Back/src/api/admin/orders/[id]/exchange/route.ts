import { ExchangeService } from "services/exchange";
import { OrderService } from "services/order";
import { container } from "tsyringe";

export const POST: ApiHandler = async (req, res) => {
  const { id } = req.params;
  const orderService = container.resolve(OrderService);
  const { items } = req.body;
  if (
    !items ||
    (items?.length === 0 &&
      items?.some((item: any) => item?.swap?.length === 0))
  )
    return res.status(404).json({ error: "데이터가 부족합니다" });
  if (
    !(await orderService.isExists({
      where: {
        id,
      },
    }))
  )
    return res.status(404).json({ error: "찾을 수 없습니다." });
  const exchangeService = container.resolve(ExchangeService);
  await exchangeService.create({
    order_id: id,
    items,
  });
  return res.json({ message: "success" });
};
