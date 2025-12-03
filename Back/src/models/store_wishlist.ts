import { BaseEntity } from "data-source";
import { BeforeInsert, Column, Entity, Index, ManyToOne, JoinColumn } from "typeorm";
import { generateEntityId } from "utils/functions";
import { User } from "./user";
import { OfflineStore } from "./offline_store";


@Entity({ name: "store_wishlist" })
@Index(["created_at", "user_id"])
export class StoreWishlist extends BaseEntity {


    @Column({ type: "character varying", nullable: true })
    user_id?: string;

    @Column({ type: "character varying", nullable: true })
    offline_store_id?: string;

    @ManyToOne(() => OfflineStore)
    @JoinColumn({ name: "offline_store_id", referencedColumnName: "id" })
    offline_store?: OfflineStore;

    @Column({ type: "jsonb", default: {} })
    metadata?: Record<string, unknown> | null;

    @BeforeInsert()
    protected async beforeInsert(): Promise<void> {
        this.id = generateEntityId(this.id, "ofs");
    }
}
