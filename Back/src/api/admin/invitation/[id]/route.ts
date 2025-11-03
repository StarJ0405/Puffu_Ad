import { container } from "tsyringe";
import { InvitationService } from "services/invitation";

export const GET: ApiHandler = async (req, res) => {
  const svc = container.resolve(InvitationService);
  const { id } = req.params;
  const { relations, select } = req.query;
  const one = await svc.get({ where: { id }, relations, select } as any);
  return res.json(one);
};

export const POST: ApiHandler = async (req, res) => {
  const svc = container.resolve(InvitationService);
  const { id } = req.params;
  const patch = req.query;
  await svc.update({ id } as any, patch);
  const updated = await svc.getById(id, {});
  return res.json(updated);
};

export const DELETE: ApiHandler = async (req, res) => {
  const svc = container.resolve(InvitationService);
  const { id } = req.params;
  await svc.delete({ id } as any, true);
  return res.json({ ok: true });
};
