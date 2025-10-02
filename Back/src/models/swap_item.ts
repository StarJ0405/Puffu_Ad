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
import { ExchangeItem } from "./exchange_item";
import { Variant } from "./variant";
import { Brand } from "./brand";

@Entity({ name: "swap_item" })
@Index(["created_at"])
export class SwapItem extends BaseEntity {
  @Column({ type: "character varying", nullable: false })
  exchange_item_id?: string;

  @ManyToOne(() => ExchangeItem, (item) => item.swaps)
  @JoinColumn({ name: "exchange_item_id", referencedColumnName: "id" })
  exchange_item?: ExchangeItem;

  @Column({ type: "character varying", nullable: false })
  variant_id?: string;

  @ManyToOne(() => Variant)
  @JoinColumn({ name: "variant_id", referencedColumnName: "id" })
  variant?: Variant;

  @Column({ type: "character varying", nullable: false })
  brand_id?: string;

  @ManyToOne(() => Brand)
  @JoinColumn({ name: "brand_id", referencedColumnName: "id" })
  brand?: Brand;

  @Column({ type: "integer", nullable: false, default: 0 })
  quantity!: number;

  @Column({ type: "character varying", nullable: true })
  product_title?: string;

  @Column({ type: "character varying", nullable: true })
  variant_title?: string;
  get title(): string | undefined {
    if (this.product_title && this.variant_title)
      return this.product_title + " " + this.variant_title;
    else if (this.product_title) return this.product_title;
    else if (this.variant_title) return this.variant_title;
    else return undefined;
  }
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

  @Column({ type: "jsonb", default: {} })
  metadata?: Record<string, unknown> | null;

  @BeforeInsert()
  protected async BeforeInsert(): Promise<void> {
    this.id = generateEntityId(this.id, "swi");
  }

  toJSON() {
    return {
      ...this,
      title: this.title,
      total: this.total,
      total_discount: this.total_discount,
    };
  }
}
