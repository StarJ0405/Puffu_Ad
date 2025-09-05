import { Address } from "models/address";
import { AddressService } from "services/address";
import { container } from "tsyringe";

export const POST: ApiHandler = async (req, res) => {
  const user = req.user;
  const { id } = req.params;
  const {
    name,
    phone,
    address1,
    address2,
    postal_code,
    default: _default,
    metadata,
    return_data = false,
  } = req.body;

  const service: AddressService = container.resolve(AddressService);
  try {
    const _data = {
      name,
      phone,
      address1,
      address2,
      postal_code,
      default: _default,
      metadata,
    };
    const result: UpdateResult<Address> = await service.update(
      { id: id, user_id: user.id },
      _data,
      true
    );
    return res.json(return_data ? { content: result } : { message: "success" });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message, status: 500 });
  }
};

export const GET: ApiHandler = async (req, res) => {
  const user = req.user;
  const { id } = req.params;
  const { select, relations, withDeleted } = req.parsedQuery;
  const service: AddressService = container.resolve(AddressService);

  let content = await service.getById(id, { select, relations, withDeleted });
  if (content?.user_id !== user.id) content = null;
  return res.json({ content });
};

export const DELETE: ApiHandler = async (req, res) => {
  const user = req.user;
  const { id } = req.params;
  const { soft } = req.parsedQuery;
  const service: AddressService = container.resolve(AddressService);
  const result = await service.delete(
    {
      id,
      user_id: user.id,
    },
    soft
  );
  if (result) {
    return res.json({ message: "sucess" });
  } else {
    return res.status(404).json({ error: "fail" });
  }
};
