import { Wishlist } from "models/wishlist";
import { WishlistService } from "services/wishlist";
import { container } from "tsyringe";

export const POST: ApiHandler = async (req, res) => {
  const user = req.user;
  const { id } = req.params;
  const { product_id, metadata, return_data = false } = req.body;

  const service: WishlistService = container.resolve(WishlistService);
  try {
    const _data = {
      product_id,
      metadata,
    };
    const result: UpdateResult<Wishlist> = await service.update(
      { id: id, user_id: user.id },
      _data,
      true
    );
    return res.json(return_data ? { content: result } : { message: "success" });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message, status: 500 });
  }
};

export const GET: ApiHandler = async (req, res) => {
  const user = req.user;
  const { id } = req.params;
  const { select, relations, withDeleted } = req.parsedQuery;
  const service: WishlistService = container.resolve(WishlistService);

  let content = await service.getById(id, { select, relations, withDeleted });
  if (content?.user_id !== user.id) content = null;
  return res.json({ content });
};

export const DELETE: ApiHandler = async (req, res) => {
  const user = req.user;
  const { id } = req.params;
  const { soft } = req.parsedQuery;
  const service: WishlistService = container.resolve(WishlistService);
  const result = await service.delete(
    {
      id,
      user_id: user.id,
    },
    soft
  );
  if (result) {
    return res.json({ message: "sucess" });
  } else {
    return res.status(404).json({ error: "fail" });
  }
};
