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
import { Address } from "./address";
import { CalcType, Coupon } from "./coupon";
import { Exchange } from "./exchange";
import { LineItem } from "./line_item";
import { Refund } from "./refund";
import { ShippingMethod } from "./shipping_method";
import { Store } from "./store";
import { User } from "./user";
import { Subscribe } from "./subscribe";

export enum OrderStatus {
  AWAITING = "awaiting",
  PENDING = "pending",
  FULFILLED = "fulfilled",
  SHIPPING = "shipping",
  COMPLETE = "complete",
  CANCEL = "cancel",
}

@Entity({ name: "order" })
@Index(["created_at"])
// CREATE INDEX IF NOT EXISTS idx_order_id ON public.order USING GIN (fn_text_to_char_array(id));
// CREATE INDEX IF NOT EXISTS idx_order_display ON public.order USING GIN (fn_text_to_char_array(display));
export class Order extends BaseEntity {
  @Column({ type: "character varying", nullable: false, unique: true })
  display?: string;

  @Column({ type: "character varying", nullable: false })
  user_id?: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  user?: User;

  @Column({ type: "character varying", nullable: false })
  store_id?: string;

  @ManyToOne(() => Store)
  @JoinColumn({ name: "store_id", referencedColumnName: "id" })
  store?: Store;

  @OneToOne(() => Address, (address) => address.order, {
    cascade: ["insert", "update"],
    orphanedRowAction: "soft-delete",
  })
  address?: Address;

  @OneToOne(() => ShippingMethod, (shipping_method) => shipping_method.order, {
    cascade: ["insert", "update"],
    orphanedRowAction: "soft-delete",
  })
  shipping_method?: ShippingMethod;

  @OneToMany(() => LineItem, (item) => item.order)
  items?: LineItem[];

  @Column({
    type: "enum",
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status?: OrderStatus;

  get total(): number {
    return (
      this.items?.reduce((acc, now) => {
        return acc + (now.unit_price || 0) * now.quantity;
      }, 0.0) || 0.0
    );
  }
  get total_tax(): number {
    return (
      this.items?.reduce((acc, now) => {
        return (
          acc +
          ((now.discount_price || 0) * now.quantity * (now.tax_rate || 0)) /
            100.0
        );
      }, 0.0) || 0.0
    );
  }

  get total_discounted(): number {
    return (
      this.items?.reduce((acc, now) => acc + (now.total_final || 0), 0.0) || 0.0
    );
  }
  get delivery_fee(): number {
    const amount = this.shipping_method?.amount || 0;
    if (this.shipping_method?.coupons?.length) {
      const [percents, fix] = this.shipping_method.coupons.reduce(
        (acc, now) => {
          if (now.calc === CalcType.FIX) acc[1] += now.value;
          else if (now.calc === CalcType.PERCENT) acc[0] += now.value;
          return acc;
        },
        [0, 0]
      ) || [0, 0];
      return Math.max(0, Math.round((amount * (100 - percents)) / 100.0 - fix));
    }
    return amount;
  }
  get total_final(): number {
    const amount = this.total_discounted + this.delivery_fee;
    if (this.coupons?.length) {
      const [percents, fix] = this.coupons.reduce(
        (acc, now) => {
          if (now.calc === CalcType.FIX) acc[1] += now.value;
          else if (now.calc === CalcType.PERCENT) acc[0] += now.value;
          return acc;
        },
        [0, 0]
      ) || [0, 0];
      return Math.max(
        0,
        Math.round(
          (amount * (100 - percents - (this.subscribe?.percent || 0))) / 100.0 -
            fix
        ) - (this.point || 0)
      );
    } else if (this.subscribe?.percent) {
      return Math.max(
        0,
        Math.round((amount * (100 - (this.subscribe?.percent || 0))) / 100.0) -
          (this.point || 0)
      );
    }
    return amount - (this.point || 0);
  }
  @Column({
    type: "timestamp with time zone",
    default: () => "CURRENT_TIMESTAMP",
  })
  captured_at?: Date;

  @Column({ type: "jsonb", default: {} })
  payment_data?: Record<string, unknown> | null;

  @Column({
    type: "timestamp with time zone",
    nullable: true,
  })
  canceled_at?: Date;

  @Column({ type: "jsonb", default: {} })
  cancel_data?: Record<string, unknown> | null;

  @Column({ type: "jsonb", default: {} })
  metadata?: Record<string, unknown> | null;

  @Column({ type: "integer", default: 0 })
  point?: number;

  @OneToMany(() => Refund, (refund) => refund.order)
  refunds?: Refund[];

  @OneToMany(() => Exchange, (exchange) => exchange.order)
  exchanges?: Exchange[];

  @OneToMany(() => Coupon, (coupon) => coupon.order)
  coupons?: Coupon[];

  @Column({ type: "character varying", nullable: true })
  subscribe_id?: string;

  @ManyToOne(() => Subscribe)
  @JoinColumn({ name: "subscribe_id", referencedColumnName: "id" })
  subscribe?: Subscribe;

  @BeforeInsert()
  protected async BeforeInsert(): Promise<void> {
    this.id = generateEntityId(this.id, "ord");
  }
  toJSON() {
    return {
      ...this,
      total: this.total,
      total_discounted: this.total_discounted,
      total_tax: this.total_tax,
      delivery_fee: this.delivery_fee,
      total_final: this.total_final,
    };
  }
}
