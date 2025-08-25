import { ApiHandler } from "app";
import { ProductService } from "services/product";
import { container } from "tsyringe";

export const GET: ApiHandler = async (req, res) => {
  let {
    pageSize,
    pageNumber = 0,
    relations,
    order,
    select,
    ...where
  } = req.parsedQuery;
  const service: ProductService = container.resolve(ProductService);
  where.visible = true;
  if (!relations) {
    relations = ["variants"];
  } else {
    if (Array.isArray(relations)) {
      if (!relations.some((r) => r.startsWith("variants"))) {
        relations.push("variants");
      }
    } else if (!relations.startsWith("variants")) {
      relations = [relations, "variants"];
    }
  }
  if (where.variants) {
    const variants = where.variants;
    variants.visible = true;
    where.variants = variants;
  } else {
    where.variants = { visible: true };
  }
  if (select && !select.includes("visible")) {
    select.push("visible");
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
