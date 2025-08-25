import { ApiHandler } from "app";
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

    user.point = user.metadata.point || 0;
    return res.json({
      user,
      access_token,
    });
  }
  return res.status(404).json("Unauthorized");
};
