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
import { EventBundle } from "./bundle";
import { Product } from "./product";

@Entity({ name: "bundle_product" })
@Index(["created_at"])
export class BundleProduct extends BaseEntity {
  @Column({ type: "character varying", nullable: false })
  bundle_id?: string;

  @ManyToOne(() => EventBundle, (eb) => eb.products)
  @JoinColumn({ name: "bundle_id", referencedColumnName: "id" })
  bundle?: EventBundle;

  @Column({ type: "character varying", nullable: false })
  product_id?: string;

  @ManyToOne(() => Product, (product) => product.bundles)
  @JoinColumn({ name: "product_id", referencedColumnName: "id" })
  product?: Product;

  @Column({ type: "jsonb", default: {} })
  metadata?: Record<string, unknown> | null;

  @BeforeInsert()
  protected async BeforeInsert(): Promise<void> {
    this.id = generateEntityId(this.id, "bnpr");
  }
}
