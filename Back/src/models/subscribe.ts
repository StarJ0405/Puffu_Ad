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
import { Order } from "./order";
import { Store } from "./store";
import { User } from "./user";

@Entity({ name: "subscribe" })
@Index(["created_at"])
export class Subscribe extends BaseEntity {
  @Column({ type: "character varying", nullable: false })
  store_id?: string;

  @ManyToOne(() => Store)
  @JoinColumn({ name: "store_id", referencedColumnName: "id" })
  store?: Store;

  @Column({ type: "character varying", nullable: false })
  name?: string;

  @Column({ type: "real", nullable: false })
  price?: number;

  @Column({ type: "real", nullable: false })
  percent?: number;

  @Column({ type: "real", nullable: false })
  value?: number;

  // 유저 소지
  @Column({ type: "character varying", nullable: true })
  user_id?: string | null;

  @ManyToOne(() => User, (user) => user.subsribes)
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  user?: User;

  @Column({ type: "timestamp with time zone", nullable: true })
  starts_at?: Date | string | null;

  @Column({ type: "timestamp with time zone", nullable: true })
  ends_at?: Date | string | null;

  @Column({ type: "jsonb", default: {} })
  cancel_data?: Record<string, unknown> | null;

  @Column({ type: "timestamp with time zone", nullable: true })
  canceled_at?: Date | string | null;

  @Column({ type: "jsonb", default: {} })
  payment_data?: Record<string, unknown> | null;

  @Column({ type: "boolean", default: false })
  repeat?: boolean;

  @Column({ type: "jsonb", default: {} })
  metadata?: Record<string, unknown> | null;

  @OneToMany(() => Order, (order) => order.subscribe)
  orders?: Order[];

  @BeforeInsert()
  protected async BeforeInsert(): Promise<void> {
    this.id = generateEntityId(this.id, "sub");
  }
  toJSON() {
    const result = {
      ...this,
      used:
        ((this.orders
          ?.filter((o) => !o.canceled_at)
          ?.reduce(
            (acc, now) => acc + (now.total_discounted || 0) + now.delivery_fee,
            0
          ) || 0) *
          (this.percent || 0)) /
        100.0,
    };
    delete result.orders;
    return result;
  }
}
