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

@Entity({ name: "counterparty" })
@Index(["created_at"])
@Index(["store_id", "name"])
@Index(["store_id", "biz_no"])
@Index(["status"])
export class Counterparty extends BaseEntity {
  @Column({ type: "character varying", nullable: false })
  store_id!: string;

  @ManyToOne(() => Store)
  @JoinColumn({ name: "store_id", referencedColumnName: "id" })
  store?: Store;

  @Column({ type: "character varying", nullable: false })
  name!: string;

  @Column({ type: "character varying", nullable: true })
  email?: string;

  @Column({ type: "character varying", nullable: true })
  phone?: string;

  @Column({ type: "character varying", nullable: true })
  biz_no?: string;

  @Column({ type: "character varying", nullable: true })
  channel?: string;

  @Column({ type: "character varying", nullable: true })
  bank?: string;

  @Column({ type: "character varying", nullable: true })
  bank_account?: string;

  @Column({ type: "character varying", default: "active", nullable: false })
  status!: string; // active | blocked | archived

  @Column({ type: "text", array: true, default: () => "'{}'" })
  tags!: string[];

  @Column({ type: "jsonb", default: {} })
  metadata?: Record<string, unknown> | null;

  @BeforeInsert()
  protected BeforeInsert(): void {
    this.id = generateEntityId(this.id, "ctrp");
  }
}
