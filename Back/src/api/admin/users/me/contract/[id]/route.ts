import { container } from "tsyringe";
import { ContractService } from "services/contract";

export const GET: ApiHandler = async (req, res) => {
  const svc = container.resolve(ContractService);
  const id = String(req.params.id);
  const data = await svc.getById(id, {
    relations: ["pages", "pages.input_fields", "contract_users"],
  });
  return res.json(data);
};

export const PUT: ApiHandler = async (req, res) => {
  const svc = container.resolve(ContractService);
  const id = String(req.params.id);
  const payload = req.body;
  await svc.updateContractWithPages(id, payload, req.user?.id);
  return res.json({ success: true });
};

export const DELETE: ApiHandler = async (req, res) => {
  const svc = container.resolve(ContractService);
  const id = String(req.params.id);
  await svc.deleteContract(id);
  return res.json({ success: true });
};
