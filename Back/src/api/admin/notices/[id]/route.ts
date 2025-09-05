import { Notice } from "models/notice";
import { NoticeService } from "services/notice";
import { container } from "tsyringe";

export const POST: ApiHandler = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    store_id,
    detail,
    type,
    starts_at,
    ends_at,
    adult,
    visible,
    metadata,
    return_data = false,
  } = req.body;

  const service: NoticeService = container.resolve(NoticeService);
  try {
    const _data = {
      title,
      store_id,
      detail,
      type,
      starts_at,
      ends_at,
      adult,
      visible,
      metadata,
    };
    const result: UpdateResult<Notice> = await service.update(
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
  const service: NoticeService = container.resolve(NoticeService);

  const content = await service.getById(id, { select, relations, withDeleted });
  return res.json({ content });
};

export const DELETE: ApiHandler = async (req, res) => {
  const { id } = req.params;
  const { soft } = req.parsedQuery;
  const service: NoticeService = container.resolve(NoticeService);
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
