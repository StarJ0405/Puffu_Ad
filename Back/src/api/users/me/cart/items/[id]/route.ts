import { CartService } from "services/cart";
import { LineItemService } from "services/line_item";
import { container } from "tsyringe";

export const POST: ApiHandler = async (req, res) => {
  const user = req.user;
  const { id } = req.params;
  const { variant_id, extra = false } = req.body;

  if (!variant_id)
    return res
      .status(404)
      .json({ error: "필요한 정보가 누락되었습니다.", status: 404 });

  const service = container.resolve(LineItemService);
  const cartService = container.resolve(CartService);
  try {
    const line_item = await service.getById(id, { relations: ["cart"] });
    if (!line_item || line_item?.cart?.user_id !== user.id)
      throw new Error("알 수 없는 오류가 발생했습니다.");

    if (extra) {
      const extra_quantity = line_item.extra_quantity;
      if (line_item.quantity > 0) {
        await service.update(
          {
            id: line_item.id,
          },
          {
            extra_quantity: 0,
          }
        );
        if (line_item.cart_id)
          await cartService.addItem(line_item.cart_id, {
            variant_id,
            quantity: 0,
            extra_quantity,
          });
      } else {
        await service.delete(
          {
            id: line_item.id,
          },
          false
        );
        if (line_item.cart_id)
          await cartService.addItem(line_item.cart_id, {
            variant_id,
            quantity: 0,
            extra_quantity,
          });
      }
    } else {
      const quantity = line_item.quantity;
      if (line_item?.extra_quantity > 0) {
        await service.update(
          {
            id: line_item.id,
          },
          {
            quantity: 0,
          }
        );
        if (line_item.cart_id)
          await cartService.addItem(line_item.cart_id, {
            variant_id,
            quantity,
            extra_quantity: 0,
          });
      } else {
        await service.delete(
          {
            id: line_item.id,
          },
          false
        );
        if (line_item.cart_id)
          await cartService.addItem(line_item.cart_id, {
            variant_id,
            quantity,
            extra_quantity: 0,
          });
      }
    }

    return res.json({
      message: "성공",
    });
  } catch (error) {
    return res.status(404).json({
      error: error,
      stauts: 404,
    });
  }
};
