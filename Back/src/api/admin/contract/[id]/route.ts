import { container } from "tsyringe";
import { ContractService } from "services/contract";

export const GET: ApiHandler = async (req, res) => {
  const { id } = req.params;
  const svc = container.resolve(ContractService);
  const data = await svc.getById(id, {
    relations: ["pages", "pages.input_fields", "contract_users"],
  });
  return res.json(data);
};

export const POST: ApiHandler = async (req, res) => {
  const { id } = req.params;
  const { action } = req.query;
  const svc = container.resolve(ContractService);

  if (action === "create") {
    const data = await svc.createFromTemplate(id, req.body);
    return res.json(data);
  }

  if (action === "complete") {
    await svc.completeContract(id);
    return res.json({ message: "complete" });
  }

  const data = await svc.updateContract(id, req.body);
  return res.json(data);
};

export const DELETE: ApiHandler = async (req, res) => {
  const { id } = req.params;
  const svc = container.resolve(ContractService);
  await svc.deleteContract(id);
  return res.json({ message: "deleted" });
};
