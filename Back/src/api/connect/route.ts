import { ConnectService } from "services/connect";
import { ConnectCodeService } from "services/connect-code";
import { container } from "tsyringe";
import { generateToken } from "utils/functions";

export const GET: ApiHandler = async (req, res) => {
  const { appid, code, secret } = req.parsedQuery;
  const codeService = container.resolve(ConnectCodeService);
  const _code = await codeService.getWithValid(appid, code);
  if (!_code) {
    return res.status(404).json({ error: "code가 만료되었습니다." });
  }
  const service = container.resolve(ConnectService);
  const find = await service.getByIdSecret(appid, secret);
  if (!find)
    return res.status(404).json({ error: "비정상적인 접근을 확인했습니다." });

  const access_token = generateToken(
    {
      appid,
      uuid: _code.user_id,
    },
    { expiresIn: "1h" }
  );
  res.json({ access_token });
  return await codeService.delete({ id: _code.id }, false);
};
