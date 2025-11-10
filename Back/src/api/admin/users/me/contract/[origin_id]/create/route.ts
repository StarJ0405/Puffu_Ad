import { container } from "tsyringe";
import { ContractService } from "services/contract";

export const POST: ApiHandler = async (req, res) => {
  const svc = container.resolve(ContractService);
  const template_id = String(req.params.template_id);
  const payload = req.body;
  const data = await svc.createFromTemplate(template_id, payload);
  return res.json(data);
};
