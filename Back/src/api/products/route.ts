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
  if (req.user) {
    where.user_id = req.user.id;
  }

  if (pageSize) {
    const page: any = await service.getWithOrder(
      { select, order, relations, where },
      {
        pageSize: Number(pageSize),
        pageNumber: Number(pageNumber),
      }
    );
    if (req.user) {
      page.content = page.content.map((product: any) => {
        if (product?.wishlists && product?.wishlists?.length > 0) {
          const wish = product?.wishlists.find(
            (f: any) => f.user_id === req.user.id
          );
          product.wish = wish;
          delete product.wishlists;
          return product;
        }
        return product;
      });
    }
    return res.json(page);
  } else {
    let content: any[] = await service.getWithOrder({
      select,
      order,
      relations,
      where,
    });
    if (req.user) {
      content = content.map((product: any) => {
        if (product?.wishlists && product?.wishlists?.length > 0) {
          const wish = product?.wishlists.find(
            (f: any) => f.user_id === req.user.id
          );
          product.wish = wish;
          delete product.wishlists;
          return product;
        }
        return product;
      });
    }
    return res.json({ content });
  }
};
