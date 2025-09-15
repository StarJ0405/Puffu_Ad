import { PointService } from "services/point";
import { container } from "tsyringe";

export const GET: ApiHandler = async (req, res) => {
  const user = req.user;
  const service = container.resolve(PointService);
  const content = await service.getPointDates(user.id);
  return res.json({ content });
};
