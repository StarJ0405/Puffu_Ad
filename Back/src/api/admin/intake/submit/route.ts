import { container } from "tsyringe";
import { IntakeRequestService } from "services/intake_request";

export const POST: ApiHandler = async (req, res) => {
  const svc = container.resolve(IntakeRequestService);
  const _data = req.body;
  try {
    const result = await svc.submitData(_data.token, _data);
    return res.json(
      _data._return_data
        ? { content: result }
        : { message: "success", counterparty: result }
    );
  } catch (e) {
    return res.status(500).json({ message: "error", error: String(e) });
  }
};
