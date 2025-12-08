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
import { Variant } from "./variant";
import { OfflineStore } from "./offline_store";

@Entity({ name: "stack_item" })
@Index(["kiosk_uuid", "variant_id"], { unique: true })
export class StackItem extends BaseEntity {
  @Column({ type: "character varying", nullable: false })
  kiosk_uuid!: string;

  @ManyToOne(() => OfflineStore)
  @JoinColumn({ name: "kiosk_uuid", referencedColumnName: "kiosk_uuid" })
  offline_store?: OfflineStore;

  @Column({ type: "character varying", nullable: false })
  variant_id!: string;

  @ManyToOne(() => Variant)
  @JoinColumn({ name: "variant_id", referencedColumnName: "id" })
  variant?: Variant;

  @Column({ type: "integer", default: 0 })
  stack!: number;

  @Column({ type: "integer", default: 0 })
  temp_stack!: number;

  @Column({ type: "jsonb", default: {} })
  metadata?: Record<string, unknown> | null;

  @BeforeInsert()
  protected async beforeInsert(): Promise<void> {
    this.id = generateEntityId(this.id, "stk");
  }
}
