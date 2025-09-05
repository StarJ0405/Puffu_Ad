import { User, UserRole } from "models/user";
import { UserService } from "services/user";
import { container } from "tsyringe";

export const POST: ApiHandler = async (req, res) => {
  const { id } = req.params;
  const {
    username,
    password,
    role = UserRole.MEMBER,
    name,
    phone_number,
    email,
    birthday,
    user_id,
    ci,
    di,
    biometric_algorithm,
    biometric_enabled,
    biometric_public_key,
    biometric_registered_at,
    pin_hash,
    metadata,
    return_data = false,
  } = req.body;

  const service: UserService = container.resolve(UserService);
  try {
    const _data = {
      username,
      password,
      role,
      name,
      phone_number,
      email,
      birthday,
      user_id,
      ci,
      di,
      biometric_algorithm,
      biometric_enabled,
      biometric_public_key,
      biometric_registered_at,
      pin_hash,
      metadata,
    };
    const result: UpdateResult<User> = await service.update(
      { id: id },
      _data,
      true
    );
    return res.json(return_data ? { content: result } : { message: "success" });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message, status: 500 });
  }
};

export const GET: ApiHandler = async (req, res) => {
  const { id } = req.params;
  const { select, relations, withDeleted } = req.parsedQuery;
  const service: UserService = container.resolve(UserService);

  const content = await service.getById(id, { select, relations, withDeleted });
  return res.json({ content });
};

export const DELETE: ApiHandler = async (req, res) => {
  const { id } = req.params;
  const { soft } = req.parsedQuery;
  const service: UserService = container.resolve(UserService);
  const result = await service.delete(
    {
      id,
    },
    soft
  );
  if (result) {
    return res.json({ message: "sucess" });
  } else {
    return res.status(404).json({ error: "fail" });
  }
};

export const PUT: ApiHandler = async (req, res) => {
  const { id } = req.params;
  const service: UserService = container.resolve(UserService);
  const result = await service.restore({
    id,
  });
  if (result) {
    return res.json({ message: "sucess" });
  } else {
    return res.status(404).json({ error: "fail" });
  }
};
