import { CartService } from "services/cart";
import { container } from "tsyringe";

export const POST: ApiHandler = async (req, res) => {
  const { offline_store_id, items } = req.body;

  if (!offline_store_id || !items || items.length === 0) {
    return res.status(400).json({
      error: { code: "400", message: "필수 데이터가 누락되었습니다." },
    });
  }

  const service = container.resolve(CartService);

  try {
    const result = await service.checkStock(offline_store_id, items);

    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({
      error: { code: "500", message: err?.message || "Internal Server Error" },
    });
  }
};
