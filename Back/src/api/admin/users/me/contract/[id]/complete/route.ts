import { container } from "tsyringe";
import { ContractService } from "services/contract";

export const POST: ApiHandler = async (req, res) => {
  const svc = container.resolve(ContractService);
  const id = String(req.params.id);
  await svc.completeContract(id);
  return res.json({ success: true });
};
