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
import { RefundItem } from "./refund_item";

@Entity({ name: "refund" })
@Index(["created_at"])
export class Refund extends BaseEntity {
  @Column({ type: "character varying", nullable: false })
  order_id?: string;

  @ManyToOne(() => Order, (order) => order.refunds)
  @JoinColumn({ name: "order_id", referencedColumnName: "id" })
  order?: Order;

  @Column({ type: "real", default: 0, nullable: false })
  value!: number;

  @Column({ type: "real", default: 0, nullable: false })
  point!: number;

  @Column({ type: "timestamp with time zone", nullable: true })
  completed_at?: Date | string | null;

  @Column({ type: "jsonb", default: {} })
  data?: Record<string, unknown> | null;

  @Column({ type: "jsonb", default: {} })
  metadata?: Record<string, unknown> | null;

  @OneToMany(() => RefundItem, (item) => item.refund, {
    cascade: ["insert", "update"],
    orphanedRowAction: "soft-delete",
  })
  items?: RefundItem[];

  @BeforeInsert()
  protected async BeforeInsert(): Promise<void> {
    this.id = generateEntityId(this.id, "rfd");
  }
}
