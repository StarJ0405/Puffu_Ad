import { QA } from "models/qa";
import { QAService } from "services/qa";
import { container } from "tsyringe";

export const POST: ApiHandler = async (req, res) => {
  const { id } = req.params;
  const { answer, return_data = false } = req.body;

  const service: QAService = container.resolve(QAService);
  try {
    const _data = {
      answer,
    };
    const result: UpdateResult<QA> = await service.update(
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
  const service: QAService = container.resolve(QAService);

  const content = await service.getById(id, { select, withDeleted, relations });
  return res.json({ content });
};

export const DELETE: ApiHandler = async (req, res) => {
  const { id } = req.params;
  const { soft } = req.parsedQuery;
  const service: QAService = container.resolve(QAService);
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
