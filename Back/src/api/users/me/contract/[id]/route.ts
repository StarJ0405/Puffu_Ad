import { container } from "tsyringe";
import { ContractService } from "services/contract";

export const GET: ApiHandler = async (req, res) => {
  const { id } = req.params;
  const svc = container.resolve(ContractService);

  const result = await svc.getById(id, {
    relations: ["pages", "pages.input_fields", "contract_users"],
  });

  res.json(result);
};

export const POST: ApiHandler = async (req, res) => {
  const { id } = req.params;
  const user = req.user;
  const svc = container.resolve(ContractService);

  await svc.updateContractWithPages(id, req.body, user.id);

  res.json({ success: true });
};
