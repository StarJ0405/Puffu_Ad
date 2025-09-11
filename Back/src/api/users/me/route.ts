import { User } from "models/user";
import { UserService } from "services/user";
import { container } from "tsyringe";
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
  const { password, new_password, phone } = req.body;
  const result = await comparePasswords(password, user.password_hash);
  if (!result) {
    return res.status(404).json({ error: "not allowed" });
  }
  const service = container.resolve(UserService);
  await service.update(
    {
      id: user.id,
    },
    {
      password: new_password,
      phone,
    }
  );
  return res.json({
    message: "success",
  });
};
