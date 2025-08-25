import { BaseEntity } from "data-source";
import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { generateEntityId } from "utils/functions";
import { OptionValue } from "./option-value";
import { Product } from "./product";

@Entity({ name: "variant" })
@Index(["created_at"])
// CREATE INDEX idx_varaint_title ON public.variant USING GIN (fn_text_to_char_array(title));
export class Variant extends BaseEntity {
  @Column({ type: "character varying", nullable: false })
  product_id?: string;

  @ManyToOne(() => Product, (product) => product.variants)
  @JoinColumn({ name: "product_id", referencedColumnName: "id" })
  product?: Product;

  @Column({ type: "character varying", default: "", nullable: false })
  title?: string;

  @Column({ type: "character varying", nullable: true })
  thumbnail?: string;

  @Column({ type: "real", nullable: false, default: 0.0 })
  extra_price!: number;

  get price(): number {
    return this.extra_price + (this.product?.price || 0);
  }
  get discount_price(): number {
    return this.price;
  }

  @Column({ type: "integer", default: 0 })
  stack?: number;

  @Column({ type: "boolean", default: true })
  visible?: boolean;

  @Column({ type: "boolean", default: true })
  buyable?: boolean;

  @Column({ type: "jsonb", default: {} })
  metadata?: Record<string, unknown> | null;

  @OneToMany(() => OptionValue, (value) => value.variant, {
    cascade: ["insert", "update"],
    orphanedRowAction: "soft-delete",
  })
  values?: OptionValue[];

  @BeforeInsert()
  protected async BeforeInsert(): Promise<void> {
    this.id = generateEntityId(this.id, "var");
  }
  toJSON() {
    return {
      ...this,
      price: this.price,
      discount_price: this.discount_price,
    };
  }
}
