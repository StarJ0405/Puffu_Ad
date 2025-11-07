import { container } from "tsyringe";
import { ContractUserService } from "services/contract_user";
import { ApproveStatus } from "models/contract_user";

export const POST: ApiHandler = async (req, res) => {
  const { id } = req.params; 
  const { user_id, status } = req.body; 
  const service = container.resolve(ContractUserService);

  try {
    if (!Object.values(ApproveStatus).includes(status))
      throw new Error("Invalid status");

    const result = await service.updateApproveStatus(id, user_id, status);
    return res.json(result);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};
