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
import { Event } from "./event";
import { Product } from "./product";
import { DiscountProduct } from "./discount-product";
import { DiscountVaraint } from "./discount-variant";

@Entity({ name: "event_discount" })
@Index(["created_at"])
export class EventDiscount extends BaseEntity {
  @Column({ type: "character varying", nullable: false })
  name?: string;

  @Column({ type: "character varying", nullable: false })
  event_id?: string;

  @ManyToOne(() => Event, (event) => event.discounts)
  @JoinColumn({ name: "event_id", referencedColumnName: "id" })
  event?: Event;

  @Column({ type: "real", default: 0.0, nullable: false })
  value!: number;

  @Column({ type: "jsonb", default: {} })
  metadata?: Record<string, unknown> | null;

  @OneToMany(() => DiscountProduct, (dp) => dp.discount, {
    cascade: ["insert", "update"],
    orphanedRowAction: "soft-delete",
  })
  products?: DiscountProduct[];

  @OneToMany(() => DiscountVaraint, (dp) => dp.discount, {
    cascade: ["insert", "update"],
    orphanedRowAction: "soft-delete",
  })
  variants?: DiscountVaraint[];

  @BeforeInsert()
  protected async BeforeInsert(): Promise<void> {
    this.id = generateEntityId(this.id, "dis");
  }
}
