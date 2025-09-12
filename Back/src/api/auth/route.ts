import { UserService } from "services/user";
import { container } from "tsyringe";
import { generateToken } from "utils/functions";

export const POST: ApiHandler = async (req, res) => {
  const { username, password, keep = false, role } = req.body;
  if (!username || !password) {
    return res.status(404).json({
      error: "입력되지않은 정보가 있습니다.",
      status: 404,
    });
  }
  const service = container.resolve(UserService);
  let user = await service.auth(String(username), String(password));
  if (!user) {
    user = await service.get({ where: { username } });
    if (user) {
      const metadata: any = user?.metadata;
      if (metadata?.lock) {
        const date = new Date(metadata.lock as any);
        if (date.getTime() >= new Date().getTime()) {
          return res.status(404).json({ error: "locked", status: 404 });
        } else {
          metadata.fail = 1;
          delete metadata.lock;
          await service.update({ username }, { metadata });
        }
      } else {
        const fail = Number(user?.metadata?.fail || 0);
        if (fail > 4) {
          const date = new Date();
          date.setMinutes(date.getMinutes() + 5);
          metadata.lock = date;
          await service.update({ username }, { metadata });
          return res.status(404).json({ error: "locked", status: 404 });
        } else {
          metadata.fail = fail + 1;
          await service.update({ username }, { metadata });
        }
      }
    }
    return res.status(404).json({ error: "not_correct", status: 404 });
  }
  if (user.deleted_at)
    return res.status(404).json({ error: "deleted", status: 404 });

  if (role) {
    const roles = Array.isArray(role) ? role : [role];
    if (!roles.some((role) => user.role === role))
      return res.status(404).json({ error: "not_allowed", status: 404 });
  }
  const metadata: any = user.metadata || {};
  delete metadata.fail;
  delete metadata.lock;

  await service.update({ id: user.id }, { metadata });
  return res.json({
    access_token: generateToken(
      {
        user_id: user.id,
        keep,
      },
      keep
        ? {
            expiresIn: "31d",
          }
        : {}
    ),
  });
};

export const GET: ApiHandler = async (req, res) => {
  const { phone, username, email } = req.parsedQuery;

  if (!phone && !username && !email)
    return res.status(404).json({ erorr: "조건이 부족합니다.", status: 404 });

  const service = container.resolve(UserService);
  const user = await service.get({
    where: [{ phone }, { username }, { email }],
  });

  return res.json({ exist: !!user, username: user?.username });
};
