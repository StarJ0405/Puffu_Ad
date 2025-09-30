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
import { Coupon } from "./coupon";
import { Order } from "./order";
import { Store } from "./store";

export enum ShippingType {
  DEFAULT = "default",
  REFUND = "refund",
  EXCHANGE = "exchange",
}

@Entity({ name: "shipping_method" })
@Index(["store_id", "brand_id", "order_id"])
export class ShippingMethod extends BaseEntity {
  @Column({
    type: "enum",
    enum: ShippingType,
    default: ShippingType.DEFAULT,
  })
  type?: ShippingType;

  @Column({ type: "character varying", nullable: true })
  store_id?: string | null;

  @ManyToOne(() => Store, (store) => store.methods)
  @JoinColumn({ name: "store_id", referencedColumnName: "id" })
  store?: Store;

  @Column({ type: "character varying", nullable: true })
  brand_id?: string;

  @ManyToOne(() => Brand, (brand) => brand.methods)
  @JoinColumn({ name: "brand_id", referencedColumnName: "id" })
  brand?: Brand;

  @Column({ type: "character varying", nullable: true })
  order_id?: string;

  @OneToOne(() => Order, (order) => order.shipping_method)
  @JoinColumn({ name: "order_id", referencedColumnName: "id" })
  order?: Order;

  @OneToMany(() => Coupon, (coupon) => coupon.shipping_method)
  coupons?: Coupon[];

  @Column({ type: "character varying", nullable: false })
  name?: string;

  @Column({ type: "integer", default: 0 })
  amount?: number;

  @Column({ type: "integer", default: 0 })
  min?: number;

  @Column({ type: "integer", default: 0 })
  max?: number;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ type: "character varying", nullable: true })
  tracking_number?: string;

  @Column({ type: "timestamp with time zone", nullable: true })
  shipped_at?: Date | string | null;

  @Column({ type: "jsonb", default: {} })
  metadata?: Record<string, unknown> | null;

  @BeforeInsert()
  protected async BeforeInsert(): Promise<void> {
    this.id = generateEntityId(this.id, "smd");
  }
}
