import { container } from "tsyringe";
import { ContractService } from "services/contract";

export const POST: ApiHandler = async (req, res) => {
  const { id } = req.params;
  const svc = container.resolve(ContractService);

  try {
    const result = await svc.update({ id }, req.body, true);
    return res.json({ content: result });
  } catch (e) {
    return res.status(500).json({ message: "error", error: String(e) });
  }
};

export const DELETE: ApiHandler = async (req, res) => {
  const { id } = req.params;
  const svc = container.resolve(ContractService);

  try {
    await svc.delete({ id });
    return res.json({ message: "success" });
  } catch (e) {
    return res.status(500).json({ message: "error", error: String(e) });
  }
};
