import { container } from "tsyringe";
import { ContractVersionService } from "services/contract_version";

export const GET: ApiHandler = async (req, res) => {
  const { id } = req.params;
  const { relations, select } = req.parsedQuery;
  const svc = container.resolve(ContractVersionService);
  const content = await svc.getById(id, { relations, select });
  return res.json({ content });
};

export const POST: ApiHandler = async (req, res) => {
  const { id } = req.params;
  const { body, variables, locked, return_data = false } = req.body;

  const svc = container.resolve(ContractVersionService);
  try {
    const _data = { body, variables, locked };
    const result = await svc.update({ id }, _data, true);
    return res.json(return_data ? { content: result } : { message: "success" });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message, status: 500 });
  }
};

export const DELETE: ApiHandler = async (req, res) => {
  const { id } = req.params;
  const svc = container.resolve(ContractVersionService);
  const result = await svc.delete({ id }, true);
  if (result) return res.json({ message: "success" });
  else return res.status(404).json({ error: "fail" });
};
