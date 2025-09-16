import { UserService } from "services/user";
import { container } from "tsyringe";
import { generateToken, verifyToken } from "utils/functions";

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
export const POST: ApiHandler = async (req, res) => {
  const user = req.user;
  const { password, thumbnail } = req.body;
  const service = container.resolve(UserService);
  const data: any = {};
  if (thumbnail) data.thumbnail = thumbnail;
  if (password) data.password;
  await service.update(
    {
      id: user.id,
    },
    data
  );
  return res.json({ message: "success" });
};
