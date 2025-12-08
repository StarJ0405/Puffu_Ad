import { BaseEntity } from "data-source";
import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import { generateEntityId } from "utils/functions";
import { Variant } from "./variant";
import { OfflineStore } from "./offline_store";

@Entity({ name: "variant_ofs" })
@Index(["variant_id", "offline_store_id"], { unique: true })
export class VariantOfs extends BaseEntity {
  @Column({ type: "character varying", nullable: false })
  variant_id!: string;

  @ManyToOne(() => Variant)
  @JoinColumn({ name: "variant_id", referencedColumnName: "id" })
  variant?: Variant;

  @Column({ type: "character varying", nullable: false })
  offline_store_id!: string;

  @ManyToOne(() => OfflineStore)
  @JoinColumn({ name: "offline_store_id", referencedColumnName: "id" })
  offline_store?: OfflineStore;

  @Column({ type: "character varying", nullable: false })
  kiosk_variant_id!: string;

  @Column({ type: "jsonb", default: {} })
  metadata?: Record<string, unknown> | null;

  @BeforeInsert()
  protected async beforeInsert(): Promise<void> {
    this.id = generateEntityId(this.id, "vof");
  }
}
