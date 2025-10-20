import { SubscribeService } from "services/subscribe";
import { container } from "tsyringe";

export const GET: ApiHandler = async (req, res) => {
  const { id } = req.params;
  let {
    pageSize,
    pageNumber = 0,
    relations,
    order,
    select,
    ...where
  } = req.parsedQuery;
  const service: SubscribeService = container.resolve(SubscribeService);

  where = { ...where, user_id: id };
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
    const content = await service.getList({
      select,
      order,
      relations,
      where,
    });
    return res.json({ content });
  }
};
