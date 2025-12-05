import { OfflineStoreService } from "services/offline_store";
import { StoreWishlistService } from "services/store_wishlist";
import { container } from "tsyringe";
import { In } from "typeorm";

export const GET: ApiHandler = async (req, res) => {
  const user = req.user;

  let {
    pageSize,
    pageNumber = 0,
    relations,
    order,
    select,
    ...where
  } = req.parsedQuery;
  

  const storeService: OfflineStoreService = container.resolve(OfflineStoreService);
  const wishlistService: StoreWishlistService = container.resolve(StoreWishlistService);

  const fetchStores = async () => {
    if (pageSize) {
      const page = await storeService.getPageable(
        {
          pageSize: Number(pageSize),
          pageNumber: Number(pageNumber),
        },
        {
          relations,
          order,
          select,
          where,
        }
      );

      const content = page?.content ?? page ?? [];
      return { page, content };
    } else {
      const content = await storeService.getList({
        relations,
        order,
        select,
        where,
      });

      return { page: null, content };
    }
  };

  const { page, content } = await fetchStores();
  const stores = content as any[];

  if (user?.id && stores.length > 0) {
    const ids = stores.map((s) => s.id);

    const wishlists = await wishlistService.getList({
      where: {
        user_id: user.id,
        offline_store_id: In(ids),
      },
    });

    const favoriteIds = new Set(
      wishlists.map((w: any) => w.offline_store_id)
    );

    stores.forEach((s) => {
      s.is_favorite = favoriteIds.has(s.id);
    });
  }
  
  if (pageSize) {

    if (Array.isArray(page)) {
      return res.json(stores);
    }

    return res.json({ ...page, content: stores });
  } else {
    return res.json({ content: stores });
  }
};
