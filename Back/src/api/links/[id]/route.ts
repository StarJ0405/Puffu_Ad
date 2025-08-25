import { ApiHandler } from "app";
import { LinkService } from "services/link";
import { container } from "tsyringe";
import { decrypt } from "utils/functions";

export const GET: ApiHandler = async (req, res) => {
  const { id } = req.params;

  const service: LinkService = container.resolve(LinkService);
  const _id = decrypt(id) || "";

  const content = await service.getById(_id);

  return res.json({
    exist: !!content,
  });
};
