import { ApiHandler } from "app";
import { UserRole } from "models/user";
import { UserService } from "services/user";
import { container } from "tsyringe";

export const GET: ApiHandler = async (req, res) => {
  const userService = container.resolve(UserService);
  const find = await userService.get({ where: { role: UserRole.ADMIN } });

  if (!find) {
    await userService.create({
      username: "admin",
      password: "supersecret",
      name: "관리자",
      role: UserRole.ADMIN,
    });

    return res.json({ message: "sucess init" });
  }
  return res.status(404).send("Cannot GET /init");
};
