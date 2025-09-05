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
import { ShippingMethod } from "./shipping_method";
import { Store } from "./store";
import { User } from "./user";
import { LineItem } from "./line_item";

export enum OrderStatus {
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

  @OneToMany(() => ShippingMethod, (shipping_method) => shipping_method.order, {
    cascade: ["insert", "update"],
    orphanedRowAction: "soft-delete",
  })
  shipping_methods?: ShippingMethod[];

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

  get total_discounted(): number {
    return (
      this.items?.reduce((acc, now) => {
        return acc + (now.discount_price || 0) * now.quantity;
      }, 0.0) || 0.0
    );
  }

  @Column({ type: "real", default: 0.0 })
  total_refund?: number;

  @Column({
    type: "timestamp with time zone",
    default: () => "CURRENT_TIMESTAMP",
  })
  captured_at?: Date;

  @Column({ type: "jsonb", default: {} })
  payment_data?: Record<string, unknown> | null;

  @Column({ type: "jsonb", default: {} })
  metadata?: Record<string, unknown> | null;

  @BeforeInsert()
  protected async BeforeInsert(): Promise<void> {
    this.id = generateEntityId(this.id, "ord");
  }
  toJSON() {
    return {
      ...this,
      total: this.total,
      total_discounted: this.total_discounted,
    };
  }
}
