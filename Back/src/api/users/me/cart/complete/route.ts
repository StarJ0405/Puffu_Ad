import { CartService } from "services/cart";
import { container } from "tsyringe";

export const POST: ApiHandler = async (req, res) => {
  const user = req.user;
  const {
    cart_id,
    selected,
    address_id,
    shipping_method_id,
    message,
    payment,
  } = req.body;
  const serivce = container.resolve(CartService);

  try {
    const order = await serivce.complete({
      user_id: user.id,
      cart_id,
      selected,
      address_id,
      shipping_method_id,
      message,
      payment,
    });
    return res.json({
      content: order,
    });
  } catch (err: any) {
    return res.json({ error: err?.message });
  }
};
