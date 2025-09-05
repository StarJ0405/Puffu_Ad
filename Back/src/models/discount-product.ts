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
import { Product } from "./product";

@Entity({ name: "discount_product" })
@Index(["created_at"])
export class DiscountProduct extends BaseEntity {
  @Column({ type: "character varying", nullable: false })
  discount_id?: string;

  @ManyToOne(() => EventDiscount, (ed) => ed.products)
  @JoinColumn({ name: "discount_id", referencedColumnName: "id" })
  discount?: EventDiscount;

  @Column({ type: "character varying", nullable: false })
  product_id?: string;

  @ManyToOne(() => Product, (product) => product.discounts)
  @JoinColumn({ name: "product_id", referencedColumnName: "id" })
  product?: Product;

  @Column({ type: "jsonb", default: {} })
  metadata?: Record<string, unknown> | null;

  @BeforeInsert()
  protected async BeforeInsert(): Promise<void> {
    this.id = generateEntityId(this.id, "dipr");
  }
}
