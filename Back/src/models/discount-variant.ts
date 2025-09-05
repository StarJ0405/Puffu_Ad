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
import { EventDiscount } from "./discount";
import { Variant } from "./variant";

@Entity({ name: "discount_variant" })
@Index(["created_at"])
export class DiscountVaraint extends BaseEntity {
  @Column({ type: "character varying", nullable: false })
  discount_id?: string;

  @ManyToOne(() => EventDiscount, (ed) => ed.variants)
  @JoinColumn({ name: "discount_id", referencedColumnName: "id" })
  discount?: EventDiscount;

  @Column({ type: "character varying", nullable: false })
  variant_id?: string;

  @ManyToOne(() => Variant, (variant) => variant.discounts)
  @JoinColumn({ name: "variant_id", referencedColumnName: "id" })
  variant?: Variant;

  @Column({ type: "jsonb", default: {} })
  metadata?: Record<string, unknown> | null;

  @BeforeInsert()
  protected async BeforeInsert(): Promise<void> {
    this.id = generateEntityId(this.id, "diva");
  }
}
