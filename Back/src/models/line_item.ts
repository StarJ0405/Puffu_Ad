import { BaseEntity } from "data-source";
import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from "typeorm";
import { generateEntityId } from "utils/functions";
import { Brand } from "./brand";
import { Cart } from "./cart";
import { Order } from "./order";
import { Review } from "./review";
import { Variant } from "./variant";
import { RefundItem } from "./refund_item";
import { Coupon } from "./coupon";

@Entity({ name: "line_item" })
@Index(["created_at"])
// CREATE INDEX IF NOT EXISTS idx_line_item_id ON public.line_item USING GIN (fn_text_to_char_array(id));
// CREATE INDEX IF NOT EXISTS idx_line_item_product_title ON public.line_item USING GIN (fn_text_to_char_array(product_title));
// CREATE INDEX IF NOT EXISTS idx_line_item_variant_title ON public.line_item USING GIN (fn_text_to_char_array(variant_title));
export class LineItem extends BaseEntity {
  @Column({ type: "character varying", nullable: true })
  cart_id?: string | null;

  @ManyToOne(() => Cart, (cart) => cart.items)
  @JoinColumn({ name: "cart_id", referencedColumnName: "id" })
  cart?: Cart;

  @Column({ type: "character varying", nullable: true })
  order_id?: string;

  @ManyToOne(() => Order, (order) => order.items)
  @JoinColumn({ name: "order_id", referencedColumnName: "id" })
  order?: Order;

  @Column({ type: "character varying", nullable: false })
  variant_id?: string;

  @ManyToOne(() => Variant)
  @JoinColumn({ name: "variant_id", referencedColumnName: "id" })
  variant?: Variant;

  @Column({ type: "character varying", nullable: true })
  brand_id?: string;

  @ManyToOne(() => Brand)
  @JoinColumn({ name: "brand_id", referencedColumnName: "id" })
  brand?: Brand;

  @Column({ type: "integer", nullable: false, default: 0 })
  quantity!: number;

  @Column({ type: "integer", nullable: false, default: 0 })
  extra_quantity!: number;

  get total_quantity(): number {
    return this.quantity + this.extra_quantity;
  }

  // 이 밑은 구매 완료 후 채워지는 내용들
  get title(): string | undefined {
    if (this.product_title && this.variant_title)
      return this.product_title + " " + this.variant_title;
    else if (this.product_title) return this.product_title;
    else if (this.variant_title) return this.variant_title;
    else return undefined;
  }

  @Column({ type: "character varying", nullable: true })
  product_title?: string;

  @Column({ type: "character varying", nullable: true })
  variant_title?: string;

  @Column({ type: "character varying", nullable: true })
  description?: string;

  @Column({ type: "character varying", nullable: true })
  thumbnail?: string;

  @Column({ type: "real", nullable: true })
  unit_price?: number;

  @Column({ type: "real", nullable: true })
  tax_rate?: number;

  @Column({ type: "real", nullable: true })
  discount_price?: number;

  @Column({ type: "real", nullable: true })
  shared_price?: number;

  get total(): number | undefined {
    if (typeof this.unit_price !== "undefined")
      return this.quantity * this.unit_price;
    return undefined;
  }
  get total_tax(): number | undefined {
    if (
      typeof this.discount_price !== "undefined" &&
      typeof this.tax_rate !== "undefined"
    )
      return (this.quantity * this.discount_price * this.tax_rate) / 100.0;
    return undefined;
  }

  get total_discount(): number | undefined {
    if (typeof this.discount_price !== "undefined")
      return this.quantity * this.discount_price;
    return undefined;
  }

  @Column({ type: "character varying", nullable: true })
  currency_unit?: string;

  @Column({ type: "boolean", default: false })
  confirmation?: boolean;

  @Column({ type: "jsonb", default: {} })
  metadata?: Record<string, unknown> | null;

  @OneToOne(() => Review, (review) => review.item)
  review?: Review;

  @OneToMany(() => RefundItem, (refund) => refund.item)
  refunds?: RefundItem[];

  @OneToMany(() => Coupon, (coupons) => coupons.item)
  coupons?: Coupon[];

  @BeforeInsert()
  protected async BeforeInsert(): Promise<void> {
    this.id = generateEntityId(this.id, "ltm");
  }
  toJSON() {
    return {
      ...this,
      total_quantity: this.total_quantity,
      title: this.title,
      total: this.total,
      total_discount: this.total_discount,
    };
  }
}
