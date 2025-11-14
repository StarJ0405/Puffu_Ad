import { container } from "tsyringe";
import { ContractUserService } from "services/contract_user";
import { ApproveStatus } from "models/contract_user";

export const POST: ApiHandler = async (req, res) => {
  const { id: contractId, userId: contractUserId } = req.params;
  const { status } = req.body;

  const svc = container.resolve(ContractUserService);

  try {
    const result = await svc.updateApproveStatus(
      contractId,
      contractUserId,
      status as ApproveStatus
    );

    return res.json({
      message: "참여자 상태가 업데이트되었습니다.",
      data: result,
    });
  } catch (err) {
    return res.status(400).json({ message: (err as Error).message });
  }
};
