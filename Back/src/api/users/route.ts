import { UserRole } from "models/user";
import { GroupService } from "services/group";
import { UserService } from "services/user";
import { container } from "tsyringe";
import { generateToken } from "utils/functions";

export const POST: ApiHandler = async (req, res) => {
  const { username, password, email, name, phone, birthday, metadata } =
    req.body;

  const service: UserService = container.resolve(UserService);
  const user = await service.create({
    username,
    password,
    email,
    name,
    phone,
    birthday,
    metadata,
    role: UserRole.MEMBER,
  });
  const groupService = container.resolve(GroupService);
  await groupService.updateUserGroup(user.id);

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
