import { ApiHandler } from "app";
import { OrderService } from "services/order";
import { container } from "tsyringe";

export const POST: ApiHandler = async (req, res) => {
  const { id } = req.body;
  const service = container.resolve(OrderService);
  try {
    await Promise.all(
      (Array.isArray(id) ? id : [id]).map(
        async (_id) => await service.cancelOrder(_id)
      )
    );
    return res.json({ message: "success" });
  } catch (err: any) {
    return res.status(404).json({ error: err?.message });
  }
};
