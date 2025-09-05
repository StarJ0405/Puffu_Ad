import { AddressService } from "services/address";
import { container } from "tsyringe";

export const POST: ApiHandler = async (req, res) => {
  const user = req.user;
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
      user_id: user.id,
      name,
      phone,
      address1,
      address2,
      postal_code,
      default: _default,
      metadata,
    };

    const result = await service.create(_data);

    return res.json(return_data ? { content: result } : { message: "success" });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message, status: 500 });
  }
};

export const GET: ApiHandler = async (req, res) => {
  const user = req.user;
  let {
    pageSize,
    pageNumber = 0,
    relations,
    order,
    select,
    ...where
  } = req.parsedQuery;
  const service: AddressService = container.resolve(AddressService);
  where = { ...where, user_id: user.id };
  if (pageSize) {
    const page = await service.getPageable(
      {
        pageSize: Number(pageSize),
        pageNumber: Number(pageNumber),
      },
      { select, order, relations, where }
    );
    return res.json(page);
  } else {
    const content = await service.getList({ select, order, relations, where });
    return res.json({ content });
  }
};
