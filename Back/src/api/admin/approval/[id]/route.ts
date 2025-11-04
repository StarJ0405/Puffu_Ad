import { container } from "tsyringe";
import { ApprovalService } from "services/approval";

export const POST: ApiHandler = async (req, res) => {
  const { id } = req.params;
  const { status, reason, metadata } = req.body;
  const svc = container.resolve(ApprovalService);

  try {
    let result;
    if (status === "approved") {
      result = await svc.approve(id, metadata);
    } else if (status === "rejected") {
      result = await svc.reject(id, reason);
    } else {
      result = await svc.update({ id }, req.body, true);
    }
    return res.json({ content: result });
  } catch (e) {
    return res.status(500).json({ message: "error", error: String(e) });
  }
};
