import { container } from "tsyringe";
import { ContractService } from "services/contract";

export const POST: ApiHandler = async (req, res) => {
  const { id } = req.params;
  const { approve, user_id } = req.body;
  const svc = container.resolve(ContractService);

  // 관리자라도 동일한 서비스 메서드 재사용
  const result = await svc.updateUserApproveStatus(id, user_id, approve);
  return res.json(result);
};