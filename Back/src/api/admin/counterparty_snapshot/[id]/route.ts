import { container } from "tsyringe";
import { CounterpartySnapshotService } from "services/counterparty_snapshot";

export const DELETE: ApiHandler = async (req, res) => {
  const svc = container.resolve(CounterpartySnapshotService);
  const { id } = req.params;

  try {
    await svc.delete({ id });
    return res.json({ message: "success" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "delete_failed" });
  }
};
