import { CategoryService } from "services/category";
import { container } from "tsyringe";

export const GET: ApiHandler = async (req, res) => {
  let {
    pageSize,
    pageNumber = 0,
    relations,
    order,
    select,
    tree,
    ...where
  } = req.parsedQuery;
  const service: CategoryService = container.resolve(CategoryService);
  if (pageSize) {
    const page = await service.getPageable(
      {
        pageSize: Number(pageSize),
        pageNumber: Number(pageNumber),
      },
      { select, order, relations, where, tree }
    );
    return res.json(page);
  } else {
    const content = await service.getList({
      select,
      order,
      relations,
      where,
      tree,
    });
    return res.json({ content });
  }
};
