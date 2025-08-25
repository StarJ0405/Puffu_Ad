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
import { Brand } from "./brand";
import { Category } from "./category";
import { Option } from "./option";
import { Store } from "./store";
import { Variant } from "./variant";

@Entity({ name: "product" })
@Index(["created_at"])
// CREATE INDEX idx_product_title ON public.product USING GIN (fn_text_to_char_array(title));
export class Product extends BaseEntity {
  @Column({ type: "character varying", nullable: false })
  store_id?: string;

  @ManyToOne(() => Store)
  @JoinColumn({ name: "store_id", referencedColumnName: "id" })
  store?: Store;

  @Column({ type: "character varying", nullable: false })
  brand_id?: string;

  @ManyToOne(() => Brand)
  @JoinColumn({ name: "brand_id", referencedColumnName: "id" })
  brand?: Brand;

  @Column({ type: "character varying", nullable: false })
  category_id?: string;

  @ManyToOne(() => Category)
  @JoinColumn({ name: "category_id", referencedColumnName: "id" })
  category?: Category;

  @Column({ type: "character varying", nullable: false })
  title?: string;

  @Column({ type: "character varying", nullable: true })
  thumbnail?: string;

  @Column({ type: "character varying", nullable: true })
  description?: string;

  @Column({ type: "character varying", nullable: true })
  detail?: string;

  @Column({ type: "real", nullable: false, default: 0.0 })
  price!: number;

  get discount_price(): number {
    return this.price;
  }

  get discount_rate(): number {
    if (this.price > 0) return this.discount_price / this.price;
    else return 0;
  }

  @Column({ type: "real", default: 0.0 })
  tax_rate?: number;

  @Column({ type: "boolean", default: true })
  visible?: boolean;

  @Column({ type: "boolean", default: true })
  buyable?: boolean;

  @Column({ type: "character varying", array: true, default: [] })
  tags?: string[];

  @Column({ type: "boolean", default: false })
  adult?: boolean;

  @Column({ type: "boolean", default: false })
  brand_mode?: boolean;

  @Column({ type: "jsonb", default: {} })
  metadata?: Record<string, unknown> | null;

  @OneToMany(() => Variant, (variant) => variant.product, {
    cascade: ["insert", "update"],
    orphanedRowAction: "soft-delete",
  })
  variants?: Variant[];

  @OneToMany(() => Option, (option) => option.product, {
    cascade: ["insert", "update"],
    orphanedRowAction: "soft-delete",
  })
  options?: Option[];
  @BeforeInsert()
  protected async BeforeInsert(): Promise<void> {
    this.id = generateEntityId(this.id, "pro");
  }
  toJSON() {
    return {
      ...this,
      discount_price: this.discount_price,
      discount_rate: this.discount_rate,
      visible:
        this.visible &&
        (this.variants?.filter((v) => v.visible)?.length || 0) > 0,
    };
  }
}
