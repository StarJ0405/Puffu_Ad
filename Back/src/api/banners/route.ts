import { BannerService } from "services/banner";
import { container } from "tsyringe";
import { IsNull, LessThanOrEqual, MoreThanOrEqual, Or } from "typeorm";

export const GET: ApiHandler = async (req, res) => {
  let {
    pageSize,
    pageNumber = 0,
    relations,
    order,
    select,
    ...where
  } = req.parsedQuery;
  const service: BannerService = container.resolve(BannerService);
  where.visible = true;
  where.starts_at = Or(IsNull(), LessThanOrEqual(new Date()));
  where.ends_at = Or(IsNull(), MoreThanOrEqual(new Date()));
  if (select) {
    if (Array.isArray(select)) {
      if (!select.includes("visible")) select.push("visible");
    } else if (select !== "visible") select = [select, "visible"];
  }

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
