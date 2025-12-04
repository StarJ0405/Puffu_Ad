import { Category } from "models/category";
import { CategoryService } from "services/category";
import { container } from "tsyringe";

export const POST: ApiHandler = async (req, res) => {
  const { id } = req.params;
  const {
    store_id,
    parent_id,
    name,
    thumbnail,
    index,
    english_name,
    metadata,
    return_data = false,
  } = req.body;

  const service: CategoryService = container.resolve(CategoryService);
  try {
    const _data = {
      store_id,
      parent_id,
      name,
      english_name,
      thumbnail,
      index,
      metadata,
    };
    const result: UpdateResult<Category> = await service.update(
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
  const { tree, select, relations, withDeleted } = req.parsedQuery;
  const service: CategoryService = container.resolve(CategoryService);

  const content = await service.getById(id, {
    tree,
    select,
    relations,
    withDeleted,
  });
  return res.json({ content });
};

export const DELETE: ApiHandler = async (req, res) => {
  const { id } = req.params;
  const { soft } = req.parsedQuery;
  const service: CategoryService = container.resolve(CategoryService);
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
