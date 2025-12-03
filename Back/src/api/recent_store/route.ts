
import { RecentStoreService } from "services/recent_store";
import { container } from "tsyringe";
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

    const service: RecentStoreService = container.resolve(RecentStoreService);

    where = { ...where, user_id: user.id };


    if (!order) {
        order = {
            created_at: "DESC",
            id: "DESC",
        };
    }

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
