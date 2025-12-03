import { StoreWishlistService } from "services/store_wishlist";
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
    const service: StoreWishlistService = container.resolve(StoreWishlistService);
    if (pageSize) {
        const page = await service.getPageable(
            {
                pageSize: Number(pageSize),
                pageNumber: Number(pageNumber),
            },
            { relations, order, select, where }
        );
        return res.json(page);
    } else {
        const content = await service.getList({ relations, order, select, where });
        return res.json({ content });
    }
};