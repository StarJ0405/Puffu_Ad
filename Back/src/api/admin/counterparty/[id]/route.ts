import { container } from "tsyringe";
import { CounterpartyService } from "services/counterparty";

export const POST: ApiHandler = async (req, res) => {
  const svc = container.resolve(CounterpartyService);
  const { id } = req.params;
  const _data = req.body;

  try {
    const result = await svc.update({ id }, _data);
    if (_data._return_data) return res.json({ content: result });
    return res.json({ message: "success" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "update_failed" });
  }
};

export const DELETE: ApiHandler = async (req, res) => {
  const svc = container.resolve(CounterpartyService);
  const { id } = req.params;

  try {
    await svc.delete({ id });
    return res.json({ message: "success" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "delete_failed" });
  }
};
