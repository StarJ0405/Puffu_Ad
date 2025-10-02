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
import { ExchangeItem } from "./exchange_item";
import { Order } from "./order";

@Entity({ name: "exchange" })
@Index(["created_at"])
export class Exchange extends BaseEntity {
  @Column({ type: "character varying", nullable: false })
  order_id?: string;

  @ManyToOne(() => Order, (order) => order.exchanges)
  @JoinColumn({ name: "order_id", referencedColumnName: "id" })
  order?: Order;

  @Column({ type: "character varying", nullable: true })
  tracking_number?: string;

  @Column({ type: "timestamp with time zone", nullable: true })
  pickup_at?: Date | string | null;

  @Column({ type: "timestamp with time zone", nullable: true })
  completed_at?: Date | string | null;

  @Column({ type: "jsonb", default: {} })
  metadata?: Record<string, unknown> | null;

  @OneToMany(() => ExchangeItem, (item) => item.exchange, {
    cascade: ["insert", "update"],
    orphanedRowAction: "soft-delete",
  })
  items?: ExchangeItem[];

  @BeforeInsert()
  protected async BeforeInsert(): Promise<void> {
    this.id = generateEntityId(this.id, "exc");
  }
}
