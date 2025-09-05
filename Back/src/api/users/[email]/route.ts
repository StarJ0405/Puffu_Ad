import { UserService } from "services/user";
import { container } from "tsyringe";

export const POST: ApiHandler = async (req, res) => {
  const { email: username } = req.params;
  const { password, code } = req.body;
  const service: UserService = container.resolve(UserService);
  const user = await service.get({
    where: { username },
  });
  if (!user) {
    return res
      .status(404)
      .json({ error: "알 수 없는 유저입니다.", status: 404 });
  }
  if (user?.metadata?.code !== code) {
    return res.status(404).json({ error: "코드가 일치하지않습니다." });
  }
  await service.update(
    { id: user.id },
    {
      password,
      metadata: () => `metadata -'code'`,
    }
  );
  return res.json({
    message: "비밀번호를 재설정했습니다.",
  });
};
