import { container } from "tsyringe";
import { ContractService } from "services/contract";

export const POST: ApiHandler = async (req, res) => {
  const { id } = req.params;
  const user = req.user;
  const { approve } = req.body;
  const svc = container.resolve(ContractService);

  try {
    const result = await svc.updateUserApproveStatus(id, user.id, approve);
    return res.json(result);
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};
