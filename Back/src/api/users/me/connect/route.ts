import { ConnectCodeService } from "services/connect-code";
import { container } from "tsyringe";

export const POST: ApiHandler = async (req, res) => {
  const user = req.user;
  const { appid } = req.body;
  const service = container.resolve(ConnectCodeService);
  const date = new Date();
  date.setTime(date.getTime() + 1000 * 60 * 3);
  const code = await service.create({
    appid,
    expires_at: date,
    user_id: user.id,
  });
  return res.json({ code: code.code });
};
