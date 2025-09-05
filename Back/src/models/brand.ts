import { BaseEntity } from "data-source";
import { BeforeInsert, Column, Entity, Index, OneToMany } from "typeorm";
import { generateEntityId } from "utils/functions";
import { ShippingMethod } from "./shipping_method";

@Entity({ name: "brand" })
@Index(["created_at"])
// CREATE INDEX IF NOT EXISTS idx_brand_name ON public.brand USING GIN (fn_text_to_char_array(name));
export class Brand extends BaseEntity {
  @Column({ type: "character varying", nullable: false })
  name?: string;

  @Column({ type: "character varying", nullable: true })
  thumbnail?: string;

  @Column({ type: "character varying", nullable: true })
  description?: string;

  @Column({ type: "jsonb", default: {} })
  metadata?: Record<string, unknown> | null;

  @OneToMany(() => ShippingMethod, (method) => method.brand)
  methods?: ShippingMethod[];

  @BeforeInsert()
  protected async BeforeInsert(): Promise<void> {
    this.id = generateEntityId(this.id, "bra");
  }
}
