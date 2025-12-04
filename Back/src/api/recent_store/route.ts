import { RecentStoreService } from "services/recent_store";
import { container } from "tsyringe";
import { RecentStore } from "models/recent_store"; 

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
        const content = await service.getList({
            relations,
            order,
            select,
            where,
        }) as RecentStore[];        

        const unique: RecentStore[] = [];
        const seenStoreIds = new Set<string>();

        for (const item of content) {
            const storeId = item.offline_store_id;             
            if (!storeId) continue;

            if (!seenStoreIds.has(storeId)) {
                seenStoreIds.add(storeId);
                unique.push(item);                
                if (unique.length >= 10) {
                    break;
                }
            }
        }

        return res.json({ content: unique });
    }
};
