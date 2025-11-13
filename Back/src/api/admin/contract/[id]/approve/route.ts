import { container } from "tsyringe";
import { ContractUserService } from "services/contract_user";
import { ApproveStatus } from "models/contract_user";

export const POST: ApiHandler = async (req, res) => {
  const { id } = req.params;
  const { user_id, status } = req.body;
  const svc = container.resolve(ContractUserService);

  try {
    const result = await svc.updateApproveStatus(
      id,
      user_id,
      status as ApproveStatus
    );

    return res.json({
      message: "참여자 상태가 업데이트되었습니다.",
      data: result,
    });
  } catch (err) {
    if (err instanceof Error)
      return res.status(400).json({ message: err.message });
    return res.status(400).json({ message: String(err) });
  }
};
