import { container } from "tsyringe";
import { ContractService } from "services/contract";

export const GET: ApiHandler = async (req, res) => {
  const svc = container.resolve(ContractService);
  const user = req.user;
  const { pageSize, pageNumber = 0, q } = req.parsedQuery;

  const where: any = {
    deleted_at: null,
    contract_users: { user_id: user.id },
  };
  if (q) where.name = q;

  const base: any = {
    where,
    relations: [
      "contract_users",
      "contract_users.user",
      "pages",
      "pages.input_fields",
    ],
    relationLoadStrategy: "join",
    order: { created_at: "DESC" },
  };

  const listData = pageSize
    ? (
        await svc.getPageable(
          { pageSize: Number(pageSize), pageNumber: Number(pageNumber) },
          base
        )
      )?.content ?? []
    : await svc.getList(base);

  for (const c of listData) {
    const full = await svc.get({
      where: { id: c.id },
      relations: [
        "contract_users",
        "contract_users.user",
        "pages",
        "pages.input_fields",
      ],
    });
    Object.assign(c, full);
  }

  return res.json(listData);
};

export const POST: ApiHandler = async (req, res) => {
  const svc = container.resolve(ContractService);
  const user = req.user;
  const { template_id, name } = req.body;

  try {
    const data = await svc.createFromTemplate(template_id, {
      name,
      user_id: user.id,
    });
    return res.json(data);
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};
