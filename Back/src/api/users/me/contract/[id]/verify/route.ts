import { container } from "tsyringe";
import { ContractService } from "services/contract";

export const GET: ApiHandler = async (req, res) => {
  const { id } = req.params;
  const svc = container.resolve(ContractService);

  try {
    const ok = await svc.verifyContractHash(id);
    return res.json({
      contract_id: id,
      valid: ok,
    });
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};
