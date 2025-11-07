import { container } from "tsyringe";
import { ContractUserService } from "services/contract_user";
import { ApproveStatus } from "models/contract_user";

export const POST: ApiHandler = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const user = req.user;
  const svc = container.resolve(ContractUserService);

  const result = await svc.updateApproveStatus(id, user.id, status as ApproveStatus);
  res.json(result);
};
