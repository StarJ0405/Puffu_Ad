import { RecentStoreService } from "services/recent_store";
import { container } from "tsyringe";
import { RecentStore } from "models/recent_store";

export const GET: ApiHandler = async (req, res) => {
    const user = req.user;

    let {
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
    let content = (await service.getList({
        relations,
        order,
        select,
        where,
    })) as RecentStore[];

    const seenStoreIds = new Set<string>();
    const unique: RecentStore[] = [];

    for (const item of content) {
        const storeId = item.offline_store_id;
        if (!storeId) continue;

        if (seenStoreIds.has(storeId)) {
            continue;
        }

        seenStoreIds.add(storeId);
        unique.push(item);

        if (unique.length >= 10) {
            break;
        }
    }
    content = unique;

    return res.json({ content });
};
