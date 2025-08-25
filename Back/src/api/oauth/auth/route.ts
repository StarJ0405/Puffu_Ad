import { ApiHandler } from "app";
import { UserRole } from "models/user";
import { AccountLinkService } from "services/account_link";
import { ConnectService } from "services/connect";
import { UserService } from "services/user";
import { container } from "tsyringe";

export const POST: ApiHandler = async (req, res) => {
  const {
    appid,
    secret,
    username,
    password,
    name,
    phone_number,
    email,
    birthday,
    ci,
    di,
    biometric_algorithm,
    biometric_enabled,
    biometric_public_key,
    biometric_registered_at,
    pin_hash,
    metadata,
  } = req.body;
  const connectService = container.resolve(ConnectService);
  const find = await connectService.getByIdSecret(
    String(appid),
    String(secret)
  );
  if (!find) return res.status(404).send("Unauthorized");
  const userService = container.resolve(UserService);
  const _data = {
    username,
    password,
    role: UserRole.MEMBER,
    name,
    phone_number,
    email,
    birthday,
    ci,
    di,
    biometric_algorithm,
    biometric_enabled,
    biometric_public_key,
    biometric_registered_at,
    pin_hash,
    metadata,
  };
  const user = await userService.create(_data);
  if (!user)
    return res.status(404).json({ error: "알 수 없는 오류가 발생했습니다." });
  const service = container.resolve(AccountLinkService);
  const result = await service.createOrUpdate({
    user_id: user.id,
    type: "puffu",
    name: appid,
    uuid: user.id,
    metadata: {
      appid,
      name: find?.name,
    },
  });
  if (!result)
    return res.status(404).json({ error: "알 수 없는 오류가 발생했습니다." });
  return res.json({ user: { ...user, accounts: [result] } });
};
