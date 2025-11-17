import { container } from "tsyringe";
import { ContractService } from "services/contract";

export const GET: ApiHandler = async (req, res) => {
  const { id } = req.params;
  const user = req.user;
  const svc = container.resolve(ContractService);

  const data = await svc.findOne({
    where: {
      id,
      contract_users: { user_id: user.id },
    },
    relations: [
      "pages",
      "pages.input_fields",
      "contract_users",
      "contract_users.user",
    ],
  });

  if (!data) return res.status(404).json({ message: "Contract not found" });
  return res.json(data);
};

export const POST: ApiHandler = async (req, res) => {
  const { id } = req.params;
  const user = req.user;
  const svc = container.resolve(ContractService);

  try {
    const result = await svc.updateContract(id, {
      ...req.body,
      user_id: user.id,
    });
    return res.json(result);
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};
