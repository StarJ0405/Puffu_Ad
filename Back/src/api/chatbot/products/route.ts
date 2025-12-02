import { OrderStatus } from "models/order";
import { OrderService } from "services/order";
import { ProductService } from "services/product";
import { container } from "tsyringe";

export const GET: ApiHandler = async (req, res) => {
  const service = container.resolve(ProductService);
  return res.json(
    await service.getList({
      relations: ["variants", "brand", "categories"],
    })
  );
};
