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
import { Exchange } from "./exchange";
import { LineItem } from "./line_item";
import { SwapItem } from "./swap_item";

@Entity({ name: "exchange_item" })
@Index(["created_at"])
export class ExchangeItem extends BaseEntity {
  @Column({ type: "character varying", nullable: false })
  exchange_id?: string;

  @ManyToOne(() => Exchange, (exchange) => exchange.items)
  @JoinColumn({ name: "exchange_id", referencedColumnName: "id" })
  exchange?: Exchange;

  @Column({ type: "character varying", nullable: false })
  item_id?: string;

  @ManyToOne(() => LineItem, (item) => item.exchanges)
  @JoinColumn({ name: "item_id", referencedColumnName: "id" })
  item?: LineItem;

  @OneToMany(() => SwapItem, (swap) => swap.exchange_item, {
    cascade: ["insert", "update"],
    orphanedRowAction: "soft-delete",
  })
  swaps?: SwapItem[];

  @Column({ type: "integer", nullable: false, default: 0 })
  quantity!: number;

  @Column({ type: "character varying", nullable: true })
  memo?: string;

  @Column({ type: "jsonb", default: {} })
  metadata?: Record<string, unknown> | null;

  @BeforeInsert()
  protected async BeforeInsert(): Promise<void> {
    this.id = generateEntityId(this.id, "exi");
  }
}
