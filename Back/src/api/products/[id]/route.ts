import { ProductService } from "services/product";
import { WishlistService } from "services/wishlist";
import { container } from "tsyringe";
import { IsNull, Or } from "typeorm";

export const GET: ApiHandler = async (req, res) => {
  const { id } = req.params;
  let { select, relations, withDeleted } = req.parsedQuery;
  const service: ProductService = container.resolve(ProductService);
  let where: any = {
    id,
    visible: true,
    variants: {
      visible: true,
    },
  };
  if (!relations) {
    relations = ["variants", "discounts.discount"];
  } else {
    relations = Array.isArray(relations) ? relations : [relations];
    if (!relations.some((r: string) => r.startsWith("variants"))) {
      relations.push("variants");
    }
    if (!relations.some((r: string) => r.startsWith("discounts.discount"))) {
      relations.push("discounts.discount");
    }
  }
  if (req.user) {
    if (!relations.some((r: string) => r.startsWith("wishlists"))) {
      relations.push("wishlists");
    }
    if (where.wishlists) {
      const wishlists = where.wishlists;
      wishlists.user_id = Or(IsNull(), req.user);
    }
  }

  if (select) {
    if (Array.isArray(select)) {
      if (!select.includes("visible")) select.push("visible");
    } else if (select !== "visible") select = [select, "visible"];
  }

  const content: any = await service.get({
    where,
    select,
    relations,
    withDeleted,
  });
  const wishlistService = container.resolve(WishlistService);
  const count = await wishlistService.getCount({
    where: {
      product_id: content?.id,
    },
  });
  content.wishes = count;
  if (req.user) {
    if (content?.wishlists && content.wishlists?.length > 0) {
      const wish = content.wishlists.find(
        (f: any) => f.user_id === req.user.id
      );
      content.wish = wish;
      delete content.wishlists;
    }
  }

  return res.json({ content });
};
