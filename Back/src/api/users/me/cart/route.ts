import { CartService } from "services/cart";
import { container } from "tsyringe";
import { IsNull } from "typeorm";

export const GET: ApiHandler = async (req, res) => {
  const user = req.user;
  const { store_id, type } = req.parsedQuery;
  if (!store_id || store_id === "undefined") return res.json(500);
  const service = container.resolve(CartService);
  let cart = await service.get({
    where: {
      user_id: user.id,
      type: type ? type : IsNull(),
      store_id,
    },
    relations: [
      "items.variant.product.brand",
      "items.variant.discounts.discount",
      "items.variant.product.discounts.discount",
      "items.variant.product.categories.parent",
    ],
  });
  if (!cart) {
    cart = await service.create({
      type: type,
      store_id,
      user_id: user.id,
    });
    cart.items = [];
  }

  return res.json({
    content: cart,
  });
};
