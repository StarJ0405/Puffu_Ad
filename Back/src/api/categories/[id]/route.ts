import { CategoryService } from "services/category";
import { container } from "tsyringe";

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
