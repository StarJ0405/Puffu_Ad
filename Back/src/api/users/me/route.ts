import { User } from "models/user";
import { SubscribeService } from "services/subscribe";
import { UserService } from "services/user";
import { container } from "tsyringe";
import { LessThanOrEqual, MoreThan } from "typeorm";
import { comparePasswords, generateToken, verifyToken } from "utils/functions";

export const GET: ApiHandler = async (req, res) => {
  const user = req.user;
  if (user) {
    const authorization = req.headers.authorization;
    let access_token;
    if (authorization) {
      const token = verifyToken(authorization);
      if (token.keep) {
        access_token = generateToken(
          { user_id: user.id, keep: true },
          { expiresIn: "31d" }
        );
      }
    }
    const service = container.resolve(UserService);
    const subscribeService = container.resolve(SubscribeService);
    user.stored = await service.getStorePayment(user.id);
    user.subscribes =
      (await subscribeService.get({
        where: {
          user_id: user.id,
          starts_at: LessThanOrEqual(new Date()),
          ends_at: MoreThan(new Date()),
        },
      })) || [];
    return res.json({
      user,
      access_token,
    });
  }
  return res.status(404).json("Unauthorized");
};

export const DELETE: ApiHandler = async (req, res) => {
  const user = req.user;
  const { reason } = req.parsedQuery;
  const service = container.resolve(UserService);
  await service.update(
    { id: user.id },
    {
      metadata: () => `metadata || '{"reason":"${reason}"}'::jsonb`,
    }
  );
  await service.delete({ id: user.id });
  return res.json({ message: "success" });
};

export const POST: ApiHandler = async (req, res) => {
  const user: User = req.user;
  const { password } = req.body;
  const result = await comparePasswords(password, user.password_hash);

  return res.json({
    message: result ? "success" : "fail",
  });
};

export const PUT: ApiHandler = async (req, res) => {
  const user: User = req.user;
  const { password, thumbnail } = req.body;

  const data: any = {};
  if (password) data.password = password;
  if (thumbnail) data.thumbnail = thumbnail;
  const service = container.resolve(UserService);
  await service.update(
    {
      id: user.id,
    },
    data
  );
  return res.json({
    message: "success",
  });
};
