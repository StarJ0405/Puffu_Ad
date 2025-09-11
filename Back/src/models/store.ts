import { BaseEntity } from "data-source";
import { BeforeInsert, Column, Entity, Index, OneToMany } from "typeorm";
import { generateEntityId } from "utils/functions";
import { ShippingMethod } from "./shipping_method";

@Entity({ name: "store" })
@Index(["created_at"])
// CREATE INDEX IF NOT EXISTS idx_store_name ON public.store USING GIN (fn_text_to_char_array(name));
export class Store extends BaseEntity {
  @Column({ type: "character varying", nullable: false })
  name?: string;

  @Column({ type: "character varying", nullable: true })
  thumbnail?: string;

  @Column({ type: "jsonb", default: {} })
  logo?: Record<string, unknown> | null;

  @Column({ type: "character varying", nullable: true })
  description?: string;

  @Column({ type: "character varying", nullable: false })
  currency_unit?: string;

  @Column({ type: "boolean", default: false })
  adult?: boolean;

  @Column({ type: "jsonb", default: {} })
  metadata?: Record<string, unknown> | null;

  @Column({ type: "integer", default: 0, nullable: false })
  index?: number;

  @Column({ type: "character varying", nullable: true, unique: true })
  subdomain?: string;

  @OneToMany(() => ShippingMethod, (method) => method.store)
  methods?: ShippingMethod[];

  @BeforeInsert()
  protected async BeforeInsert(): Promise<void> {
    this.id = generateEntityId(this.id, "sto");
  }
}
