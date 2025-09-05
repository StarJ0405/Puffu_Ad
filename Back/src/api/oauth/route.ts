import { ConnectService } from "services/connect";
import { UserService } from "services/user";
import { container } from "tsyringe";
import { verifyToken } from "utils/functions";

export const GET: ApiHandler = async (req, res) => {
  const { access_token, appid, secret } = req.query;

  const verified = verifyToken(String(access_token || ""));
  if (!verified || !verified?.exp || !verified?.uuid || !appid || !secret)
    return res.status(404).send("Unauthorized");

  const service = container.resolve(ConnectService);
  const find = await service.getByIdSecret(String(appid), String(secret));
  if (!find) return res.status(404).send("Unauthorized");

  const userService = container.resolve(UserService);
  if (new Date(verified.exp).getTime() * 1000 > new Date().getTime())
    return res.json({ user: await userService.getById(verified.uuid) });
  else return res.status(404).json({ error: "토큰이 만료되었습니다." });
};
