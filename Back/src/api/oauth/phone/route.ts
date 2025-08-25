import { ApiHandler } from "app";
import { ConnectService } from "services/connect";
import { UserService } from "services/user";
import { container } from "tsyringe";

export const GET: ApiHandler = async (req, res) => {
  const { appid, secret, phone } = req.query;
  const connectService = container.resolve(ConnectService);
  const find = await connectService.getByIdSecret(
    String(appid),
    String(secret)
  );
  if (!find) return res.status(404).send("Unauthorized");

  const userService = container.resolve(UserService);
  const user = await userService.getByPhone(String(phone));
  return res.json({ uuid: user?.id });
};
