import { Category } from "models/category";
import { CategoryService } from "services/category";
import { container } from "tsyringe";

export const POST: ApiHandler = async (req, res) => {
  const {
    store_id,
    parent_id,
    name,
    thumbnail,
    index,
    metadata,
    _amount = 1,
    _return_data = false,
  } = req.body;

  const service: CategoryService = container.resolve(CategoryService);
  try {
    let result: Category[] = [];
    const _data = {
      store_id,
      parent_id,
      name,
      thumbnail,
      index,
      metadata,
    };
    if (_amount === 1) {
      result = [await service.create(_data)];
    } else {
      result = await service.creates(_data, _amount);
    }
    return res.json(
      _return_data ? { content: result } : { message: "success" }
    );
  } catch (err: any) {
    return res.status(500).json({ error: err?.message, status: 500 });
  }
};

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
