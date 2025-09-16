import { QAService } from "services/qa";
import { container } from "tsyringe";
import { IsNull } from "typeorm";

export const GET: ApiHandler = async (req, res) => {
  let {
    _type,
    pageSize,
    pageNumber = 0,
    relations,
    order,
    select,
    ...where
  } = req.parsedQuery;
  where = {
    ...where,
    product_id: IsNull(),
    item_id: IsNull(),
    order_id: IsNull(),
  };

  const service: QAService = container.resolve(QAService);
  if (pageSize) {
    const page = await service.getPageable(
      {
        pageSize: Number(pageSize),
        pageNumber: Number(pageNumber),
      },
      { select, order, relations, where }
    );
    return res.json(page);
  } else {
    const content = await service.getList({ select, order, relations, where });
    return res.json({ content });
  }
};
