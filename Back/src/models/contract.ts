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
import { Store } from "./store";
import { Counterparty } from "./counterparty";
import { CounterpartySnapshot } from "./counterparty_snapshot";

@Entity({ name: "contract" })
@Index(["store_id"])
@Index(["starts_at"])
@Index(["ends_at"])
@Index(["created_at"])
export class Contract extends BaseEntity {
  @Column({ type: "character varying", nullable: false })
  store_id!: string;

  @ManyToOne(() => Store)
  @JoinColumn({ name: "store_id", referencedColumnName: "id" })
  store?: Store;

  @Column({ type: "character varying", nullable: false })
  counterparty_id!: string;

  @ManyToOne(() => Counterparty)
  @JoinColumn({ name: "counterparty_id", referencedColumnName: "id" })
  counterparty?: Counterparty;

  @Column({ type: "character varying", nullable: true })
  snapshot_id?: string;

  @ManyToOne(() => CounterpartySnapshot)
  @JoinColumn({ name: "snapshot_id", referencedColumnName: "id" })
  snapshot?: CounterpartySnapshot;

  @Column({ type: "character varying", nullable: true })
  title?: string;

  @Column({ type: "timestamp with time zone", nullable: true })
  starts_at?: Date;

  @Column({ type: "timestamp with time zone", nullable: true })
  ends_at?: Date;

  @Column({ type: "real", default: 0 })
  payout_rate?: number; // CHECK 0~100

  @Column({ type: "jsonb", default: {} })
  metadata?: Record<string, unknown> | null;

  @BeforeInsert()
  protected BeforeInsert(): void {
    this.id = generateEntityId(this.id, "con");
  }
}
