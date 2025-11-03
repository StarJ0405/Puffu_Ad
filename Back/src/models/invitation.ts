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

@Entity({ name: "invitation" })
@Index(["store_id"])
@Index(["token"], { unique: true })
@Index(["created_at"])
export class Invitation extends BaseEntity {
  @Column({ type: "character varying", nullable: false })
  store_id!: string;

  @ManyToOne(() => Store)
  @JoinColumn({ name: "store_id", referencedColumnName: "id" })
  store?: Store;

  @Column({ type: "character varying", nullable: false })
  token!: string;

  @Column({ type: "character varying", nullable: true })
  email?: string;

  @Column({ type: "character varying", nullable: true })
  role?: string; // ex) 'counterparty' | 'approver'

  @Column({ type: "timestamp with time zone", nullable: true })
  expires_at?: Date;

  @Column({ type: "boolean", default: false })
  accepted?: boolean;

  @Column({ type: "timestamp with time zone", nullable: true })
  accepted_at?: Date;

  @Column({ type: "jsonb", default: {} })
  metadata?: Record<string, unknown> | null;

  @BeforeInsert()
  protected BeforeInsert(): void {
    this.id = generateEntityId(this.id, "inv");
  }
}
