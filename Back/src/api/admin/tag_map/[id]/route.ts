import { container } from "tsyringe";
import { TagMapService } from "services/tag_map";

export const POST: ApiHandler = async (req, res) => {
  const { id } = req.params;
  const svc = container.resolve(TagMapService);

  try {
    const result = await svc.update({ id }, req.body, true);
    return res.json({ content: result });
  } catch (e) {
    return res.status(500).json({ message: "error", error: String(e) });
  }
};
