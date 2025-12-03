import { StoreWishlistService } from "services/store_wishlist";
import { container } from "tsyringe";


export const POST: ApiHandler = async (req, res) => {
    const user = req.user;
    const { id: storeId } = req.params;
    const { metadata, return_data = false } = req.body;

    const service: StoreWishlistService = container.resolve(StoreWishlistService);

    try {
        const created = await service.create({
            user_id: user.id,
            offline_store_id: storeId,
            metadata: metadata ?? {},
        });
        if (return_data) {
            return res.json({ content: created });
        } else {
            return res.json({ message: "success" });
        }
    } catch (err: any) {
        return res.status(500).json({ error: err?.message, status: 500 });
    }
};



export const DELETE: ApiHandler = async (req, res) => {
    const user = req.user;
    const { id } = req.params;
    const { soft } = req.parsedQuery;
    const service: StoreWishlistService = container.resolve(StoreWishlistService);
    const result = await service.delete(
        {
            id,
            user_id: user.id,
        },
        soft
    );
    if (result) {
        return res.json({ message: "sucess" });
    } else {
        return res.status(404).json({ error: "fail" });
    }
};


