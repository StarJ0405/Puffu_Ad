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
import { Counterparty } from "./counterparty";

@Entity({ name: "counterparty_snapshot" })
@Index(["created_at"])
@Index(["source_id"])
export class CounterpartySnapshot extends BaseEntity {
  @Column({ type: "character varying", nullable: false })
  source_id!: string;

  @ManyToOne(() => Counterparty)
  @JoinColumn({ name: "source_id", referencedColumnName: "id" })
  source?: Counterparty;

  @Column({ type: "jsonb", default: {} })
  data!: Record<string, unknown>;

  @Column({ type: "jsonb", default: {} })
  metadata?: Record<string, unknown> | null;

  @BeforeInsert()
  protected BeforeInsert(): void {
    this.id = generateEntityId(this.id, "ctps");
  }
}
