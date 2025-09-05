import { AccountLinkService } from "services/account_link";
import { ConnectService } from "services/connect";
import { UserService } from "services/user";
import { container } from "tsyringe";

export const POST: ApiHandler = async (req, res) => {
  const { id } = req.params;
  const { uuid, appid, secret } = req.body;
  const connectService = container.resolve(ConnectService);
  const find = await connectService.getByIdSecret(
    String(appid),
    String(secret)
  );
  if (!find) return res.status(404).send("Unauthorized");
  const userService = container.resolve(UserService);
  const user = await userService.getById(id);
  if (!user) return res.status(404).json({ error: "유저를 찾을 수 없습니다." });

  const service = container.resolve(AccountLinkService);
  const result = await service.createOrUpdate({
    user_id: user.id,
    type: "puffu",
    name: appid,
    uuid,
    metadata: {
      appid,
      name: find?.name,
    },
  });
  if (!result)
    return res.status(404).json({ error: "알 수 없는 오류가 발생했습니다." });
  return res.json({ meesage: "연동에 성공했습니다." });
};

export const DELETE: ApiHandler = async (req, res) => {
  const { id } = req.params;
  const { name, uuid, appid, secret } = req.parsedQuery;

  const connectService = container.resolve(ConnectService);
  const find = await connectService.getByIdSecret(
    String(appid),
    String(secret)
  );
  if (!find) return res.status(404).send("Unauthorized");
  const service = container.resolve(AccountLinkService);

  const userService = container.resolve(UserService);
  const user = await userService.getById(id);
  if (!user) return res.status(404).json({ error: "유저를 찾을 수 없습니다." });
  const account = await service.get({
    where: {
      user_id: user.id,
      type: "puffu",
      name,
      uuid,
    },
  });
  if (!account) return res.json({ message: "연동되어있지 않습니다." });

  const result = await service.delete({
    user_id: user.id,
    type: "puffu",
    name,
    uuid,
  });
  if (!result)
    return res.status(404).json({ error: "알 수 없는 오류가 발생했습니다." });
  return res.json({ meesage: "연동을 해제했습니다." });
};
