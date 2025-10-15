import { Condition, Target } from "models/coupon";
import { UserRole } from "models/user";
import { CouponService } from "services/coupon";
import { GroupService } from "services/group";
import { UserService } from "services/user";
import { container } from "tsyringe";
import { IsNull, MoreThan, Or } from "typeorm";
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
  const couponService = container.resolve(CouponService);
  const coupons = await couponService.getList({
    where: {
      target: Target.CONDTION,
      condition: Condition.SIGNUP,
      user_id: IsNull(),
      ends_at: Or(IsNull(), MoreThan(new Date())),
    },
  });
  if (coupons.length > 0) await couponService.giveCoupon(user.id, coupons);
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
