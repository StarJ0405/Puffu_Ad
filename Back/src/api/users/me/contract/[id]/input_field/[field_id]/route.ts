import { container } from "tsyringe";
import { ContractService } from "services/contract";

export const POST: ApiHandler = async (req, res) => {
  const { id: contractId, field_id: fieldId } = req.params;
  const { value } = req.body;
  const user = req.user;
  const svc = container.resolve(ContractService);

  try {
    const contract = await svc.findOne({
      where: {
        id: contractId,
        contract_users: { user_id: user.id },
      },
      relations: ["pages", "pages.input_fields"],
    });
    if (!contract)
      return res.status(403).json({ message: "계약 접근 권한이 없습니다." });

    const result = await svc.updateInputField(fieldId, value);

    return res.json({
      message: "입력 필드가 업데이트되었습니다.",
      data: result,
    });
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};
