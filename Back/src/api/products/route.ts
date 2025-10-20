import { Product } from "models/product";
import { ProductService } from "services/product";
import { WishlistService } from "services/wishlist";
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

  if ("warehousing" in where) {
    const w = String(where.warehousing).toLowerCase();
    if (w === "all") {
      where._warehousingAll = true; // 전체 보기 플래그
      delete where.warehousing; // 실제 필터 제거
    } else if (w === "true" || w === "1") {
      where.warehousing = true;
    } else if (w === "false" || w === "0") {
      where.warehousing = false;
    } else {
      delete where.warehousing; // 알 수 없는 값이면 필터 제거
    }
  }

  if ("product_type" in where) {
    if (where.product_type === "null") where.product_type = null;
    else if (
      where.product_type === "is_set" ||
      where.product_type === "random_box"
    )
      where.product_type = String(where.product_type);
    else delete where.product_type;
  }

  const service: ProductService = container.resolve(ProductService);
  if (req.user) {
    where.user_id = req.user.id;
  }
  const wishService: WishlistService = container.resolve(WishlistService);
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
    const wishes = await wishService.getCounts(
      page.content.map((p: Product) => p.id) || []
    );

    page.content = page.content.map((product: any) => {
      product.wishes = wishes.find((f) => f.id === product.id)?.count || 0;
      return product;
    });
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
    const wishes = await wishService.getCounts(
      content.map((p: Product) => p.id) || []
    );
    content = content.map((product: any) => {
      product.wishes = wishes.find((f) => f.id === product.id)?.count || 0;
      return product;
    });
    return res.json({ content });
  }
};
