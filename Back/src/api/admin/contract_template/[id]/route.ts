import { container } from "tsyringe";
import { ContractTemplateService } from "services/contract_template";

export const POST: ApiHandler = async (req, res) => {
  const { id } = req.params;
  const svc = container.resolve(ContractTemplateService);
  try {
    const result = await svc.update({ id }, req.body, true);
    return res.json({ content: result });
  } catch (e) {
    return res.status(500).json({ message: "error", error: String(e) });
  }
};

export const DELETE: ApiHandler = async (req, res) => {
  const { id } = req.params;
  const svc = container.resolve(ContractTemplateService);
  try {
    await svc.delete({ id });
    return res.json({ message: "success" });
  } catch (e) {
    return res.status(500).json({ message: "error", error: String(e) });
  }
};
