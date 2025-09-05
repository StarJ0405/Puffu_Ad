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
import { EventBundle } from "./bundle";

@Entity({ name: "bundle_variant" })
@Index(["created_at"])
export class BundleVaraint extends BaseEntity {
  @Column({ type: "character varying", nullable: false })
  bundle_id?: string;

  @ManyToOne(() => EventBundle, (eb) => eb.variants)
  @JoinColumn({ name: "bundle_id", referencedColumnName: "id" })
  bundle?: EventBundle;

  @Column({ type: "character varying", nullable: false })
  variant_id?: string;

  @ManyToOne(() => Variant, (variant) => variant.bundles)
  @JoinColumn({ name: "variant_id", referencedColumnName: "id" })
  variant?: Variant;

  @Column({ type: "jsonb", default: {} })
  metadata?: Record<string, unknown> | null;

  @BeforeInsert()
  protected async BeforeInsert(): Promise<void> {
    this.id = generateEntityId(this.id, "bnva");
  }
}
