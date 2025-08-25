import { ApiHandler } from "app";
import { CartService } from "services/cart";
import { container } from "tsyringe";

export const POST: ApiHandler = async (req, res) => {
  const user = req.user;
  const { store_id, type, variants } = req.body;

  if (!variants || !store_id || variants?.length === 0)
    return res
      .status(404)
      .json({ error: "필요한 정보가 누락되었습니다.", status: 404 });

  const service = container.resolve(CartService);
  const cart = await service.get({
    select: ["id"],
    where: {
      user_id: user.id,
      type,
      store_id,
    },
  });
  if (!cart)
    return res
      .status(404)
      .json({ error: "알 수 없는 오류가 발생했습니다.", status: 404 });

  try {
    Promise.all(
      (Array.isArray(variants) ? variants : [variants]).map(
        async ({
          variant_id,
          quantity = 0,
          extra_quantity = 0,
        }: {
          variant_id: string;
          quantity: number;
          extra_quantity: number;
        }) =>
          await service.addItem(cart.id, {
            variant_id,
            quantity,
            extra_quantity,
          })
      )
    );

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

export const DELETE: ApiHandler = async (req, res) => {
  const user = req.user;
  const { store_id, type, item_id } = req.parsedQuery;

  if (!item_id || !store_id)
    return res
      .status(404)
      .json({ error: "필요한 정보가 누락되었습니다.", status: 404 });

  const service = container.resolve(CartService);
  const cart = await service.get({
    select: ["id"],
    where: {
      user_id: user.id,
      type,
      store_id,
    },
  });
  if (!cart)
    return res
      .status(404)
      .json({ error: "알 수 없는 오류가 발생했습니다.", status: 404 });

  try {
    await service.removeItem(cart.id, item_id);
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

export const PUT: ApiHandler = async (req, res) => {
  const user = req.user;
  const {
    store_id,
    type,
    item_id,
    quantity = 0,
    extra_quantity = 0,
  } = req.body;

  if (!item_id || !store_id)
    return res
      .status(404)
      .json({ error: "필요한 정보가 누락되었습니다.", status: 404 });

  const service = container.resolve(CartService);
  const cart = await service.get({
    select: ["id"],
    where: {
      user_id: user.id,
      type,
      store_id,
    },
  });
  if (!cart)
    return res
      .status(404)
      .json({ error: "알 수 없는 오류가 발생했습니다.", status: 404 });

  try {
    await service.updateItem(cart.id, item_id, {
      quantity,
      extra_quantity,
    });
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
