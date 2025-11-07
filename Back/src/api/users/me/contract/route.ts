import { container } from "tsyringe";
import { ContractService } from "services/contract";

export const GET: ApiHandler = async (req, res) => {
  const svc = container.resolve(ContractService);
  const user = req.user;

  const result = await svc.getList({
    where: { contract_users: { user_id: user.id } },
    relations: ["contract_users"],
    order: { created_at: "DESC" },
  });

  res.json(result);
};
