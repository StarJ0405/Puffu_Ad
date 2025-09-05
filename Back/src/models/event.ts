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
import { EventDiscount } from "./discount";
import { Store } from "./store";
import { EventBundle } from "./bundle";

@Entity({ name: "event" })
@Index(["created_at"])
// CREATE INDEX IF NOT EXISTS idx_event_title ON public.event USING GIN (fn_text_to_char_array(title));
export class Event extends BaseEntity {
  @Column({ type: "character varying", nullable: false })
  title?: string;

  @Column({ type: "character varying", nullable: false })
  store_id?: string;

  @ManyToOne(() => Store)
  @JoinColumn({ name: "store_id", referencedColumnName: "id" })
  store?: Store;

  @Column({ type: "timestamp with time zone", nullable: true })
  starts_at?: Date | string;

  @Column({ type: "timestamp with time zone", nullable: true })
  ends_at?: Date | string;

  @Column({ type: "jsonb", default: {} })
  metadata?: Record<string, unknown> | null;

  @OneToMany(() => EventDiscount, (discount) => discount.event, {
    cascade: ["insert", "update"],
    orphanedRowAction: "soft-delete",
  })
  discounts?: EventDiscount[];

  @OneToMany(() => EventBundle, (bundle) => bundle.event, {
    cascade: ["insert", "update"],
    orphanedRowAction: "soft-delete",
  })
  bundles?: EventBundle[];

  @BeforeInsert()
  protected async BeforeInsert(): Promise<void> {
    this.id = generateEntityId(this.id, "evn");
  }
}
