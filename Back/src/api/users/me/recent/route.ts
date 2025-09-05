import { RecentService } from "services/recent";
import { container } from "tsyringe";

export const POST: ApiHandler = async (req, res) => {
  const user = req.user;
  const { user_id, product_id } = req.body;
  const service = container.resolve(RecentService);
  await service.create({
    user_id,
    product_id,
  });
  return res.json({
    message: "success",
  });
};
