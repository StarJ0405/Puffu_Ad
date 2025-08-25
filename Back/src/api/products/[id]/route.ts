import { ApiHandler } from "app";
import { ProductService } from "services/product";
import { container } from "tsyringe";

export const GET: ApiHandler = async (req, res) => {
  const { id } = req.params;
  let { select, relations, withDeleted } = req.parsedQuery;
  const service: ProductService = container.resolve(ProductService);
  const where = {
    id,
    visible: true,
    variants: {
      visible: true,
    },
  };
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
  if (select && !select.includes("visible")) {
    select.push("visible");
  }
  const content = await service.get({
    where,
    select,
    relations,
    withDeleted,
  });

  return res.json({ content });
};
