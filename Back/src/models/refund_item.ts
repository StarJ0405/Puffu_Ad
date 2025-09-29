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
import { LineItem } from "./line_item";
import { Refund } from "./refund";

@Entity({ name: "refund_item" })
@Index(["created_at"])
export class RefundItem extends BaseEntity {
  @Column({ type: "character varying", nullable: false })
  refund_id?: string;

  @ManyToOne(() => Refund, (refund) => refund.items)
  @JoinColumn({ name: "refund_id", referencedColumnName: "id" })
  refund?: Refund;

  @Column({ type: "character varying", nullable: false })
  item_id?: string;

  @ManyToOne(() => LineItem, (item) => item.refunds)
  @JoinColumn({ name: "item_id", referencedColumnName: "id" })
  item?: LineItem;

  @Column({ type: "integer", nullable: false, default: 0 })
  quantity!: number;

  @Column({ type: "character varying", nullable: true })
  memo?: string;

  @Column({ type: "jsonb", default: {} })
  metadata?: Record<string, unknown> | null;

  @BeforeInsert()
  protected async BeforeInsert(): Promise<void> {
    this.id = generateEntityId(this.id, "rfi");
  }
}
