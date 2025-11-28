import { Group } from "models/group";
import { GroupService } from "services/group";
import { container } from "tsyringe";

export const POST: ApiHandler = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    thumbnail,
    min,
    percent,
    metadata,
    return_data = false,
  } = req.body;

  const service: GroupService = container.resolve(GroupService);
  try {
    const _data = {
      name,
      thumbnail,
      min,
      percent,
      metadata,
    };
    const result: UpdateResult<Group> = await service.update(
      { id: id },
      _data,
      true
    );
    return res.json(return_data ? { content: result } : { message: "success" });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message, status: 500 });
  }
};

export const GET: ApiHandler = async (req, res) => {
  const { id } = req.params;
  const { select, relations, withDeleted } = req.parsedQuery;
  const service: GroupService = container.resolve(GroupService);

  const content = await service.getById(id, { select, relations, withDeleted });
  return res.json({ content });
};

export const DELETE: ApiHandler = async (req, res) => {
  const { id } = req.params;
  const { soft } = req.parsedQuery;
  const service: GroupService = container.resolve(GroupService);
  const result = await service.delete(
    {
      id,
    },
    soft
  );
  if (result) {
    return res.json({ message: "sucess" });
  } else {
    return res.status(404).json({ error: "fail" });
  }
};
