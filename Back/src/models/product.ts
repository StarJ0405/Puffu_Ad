import { BaseEntity } from "data-source";
import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { generateEntityId } from "utils/functions";
import { Brand } from "./brand";
import { BundleProduct } from "./bundle-product";
import { Category } from "./category";
import { DiscountProduct } from "./discount-product";
import { Option } from "./option";
import { Store } from "./store";
import { Variant } from "./variant";
import { Wishlist } from "./wishlist";

@Entity({ name: "product" })
@Index(["created_at"])
// CREATE INDEX IF NOT EXISTS idx_product_title ON public.product USING GIN (fn_text_to_char_array(title));
export class Product extends BaseEntity {
  @Column({ type: "character varying", nullable: true })
  code?: string;

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

  @Column({ type: "character varying", nullable: true })
  category_id?: string;

  @ManyToMany(() => Category, (ct) => ct.products)
  @JoinTable({
    name: "product_category",
    joinColumn: {
      name: "product_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "category_id",
      referencedColumnName: "id",
    },
  })
  categories?: Category[];

  @Column({ type: "character varying", nullable: false })
  title?: string;

  @Column({ type: "character varying", nullable: true })
  thumbnail?: string;

  @Column({ type: "character varying", nullable: true })
  description?: string;

  @Column({ type: "text", nullable: true })
  detail?: string;

  @Column({ type: "real", nullable: false, default: 0.0 })
  price!: number;

  get discount_price(): number {
    return (this.price * (100.0 - this.discount_rate)) / 100.0;
  }

  get discount_rate(): number {
    if (this.discounts && this.discounts?.length > 0) {
      return (
        this.discounts.reduce(
          (acc, now) => Math.max(acc, now.discount?.value || 0.0),
          0.0
        ) || 0.0
      );
    }

    return 0;
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

  @OneToMany(() => DiscountProduct, (dp) => dp.product)
  discounts?: DiscountProduct[];

  @OneToMany(() => BundleProduct, (bp) => bp.product)
  bundles?: BundleProduct[];

  @BeforeInsert()
  protected async BeforeInsert(): Promise<void> {
    this.id = generateEntityId(this.id, "pro");
  }

  @OneToMany(() => Wishlist, (whi) => whi.product)
  wishlists?: Wishlist[];

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
