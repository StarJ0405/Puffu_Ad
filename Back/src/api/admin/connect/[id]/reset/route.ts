import { ApiHandler } from "app";
import { ConnectService } from "services/connect";
import { container } from "tsyringe";

export const POST: ApiHandler = async (req, res) => {
  const { id } = req.params;

  const service: ConnectService = container.resolve(ConnectService);
  try {
    const secret = await service.reset(id);
    return res.json({ secret });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message, status: 500 });
  }
};

export const GET: ApiHandler = async (req, res) => {
  const { id } = req.params;
  const { select, relations, withDeleted } = req.parsedQuery;
  const service: ConnectService = container.resolve(ConnectService);

  const content = await service.getById(id, { select, relations, withDeleted });
  return res.json({ content });
};
