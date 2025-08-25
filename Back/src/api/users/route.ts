import { ApiHandler } from "app";
import { UserRole } from "models/user";
import { UserService } from "services/user";
import { container } from "tsyringe";
import { generateToken } from "utils/functions";

export const POST: ApiHandler = async (req, res) => {
  const { username, password, name, phone, birthday, metadata } = req.body;

  const service: UserService = container.resolve(UserService);
  const user = await service.create({
    username,
    password,
    name,
    phone,
    birthday,
    metadata,
    role: UserRole.MEMBER,
  });

  return res.json({
    access_token: generateToken(
      {
        user_id: user.id,
        keep: false,
      },
      {}
    ),
  });
};
