import axios from "axios";
import { OrderStatus } from "models/order";
import { OrderService } from "services/order";
import { ProductService } from "services/product";
import { container } from "tsyringe";

export const POST: ApiHandler = async (req, res) => {
  const { display } = req.params;
  const service = container.resolve(OrderService);

  try {
    const order = await service.get({
      where: { display },
      select: ["id", "display", "canceled_at", "status"],
    });
    if (order) {
      if (order.status === OrderStatus.CANCEL) {
        return res.json(`'${display}'은 이미 취소된 주문입니다.`);
      } else {
        await service.cancelOrder(order.id);
        return res.json(`'${display}'이(가) 주문 취소되었습니다.`);
      }
    } else {
      return res.json(`'${display}'은 없는 주문서입니다.`);
    }
  } catch (error) {
    return res.json(`'${display}'의 주문 취소가 실패했습니다.`);
  }
};

export const GET: ApiHandler = async (req, res) => {
  const { display } = req.params;
  const service = container.resolve(OrderService);

  try {
    const order = await service.get({
      where: { display },
      select: ["id", "display", "status"],
      relations: ["shipping_method"],
    });
    if (order) {
      if (order.status === OrderStatus.CANCEL) {
        return res.json(`'${display}'은 취소된 주문입니다.`);
      } else {
        if (order.shipping_method?.tracking_number) {
          const response = await axios.get(
            `https://apis.tracker.delivery/carriers/kr.cjlogistics/tracks/${String(
              order.shipping_method?.tracking_number
            ).replace(/-/g, "")}`
          );
          return res.json(response.data);
        } else {
          return res.json(`'${display}'은 운송장 번호가 없습니다 `);
        }
      }
    } else {
      return res.json(`'${display}'은 없는 주문서입니다.`);
    }
  } catch (error) {
    return res.json(`'${display}'의 배송 조회가 실패했습니다.`);
  }
};
