import { container } from "tsyringe";
import { EvidenceService } from "services/evidence";

export const POST: ApiHandler = async (req, res) => {
  const { id } = req.params;
  const { verified, metadata } = req.body;
  const svc = container.resolve(EvidenceService);

  try {
    const result = await svc.verify(id, verified, metadata);
    return res.json({ content: result });
  } catch (e) {
    return res.status(500).json({ message: "error", error: String(e) });
  }
};
