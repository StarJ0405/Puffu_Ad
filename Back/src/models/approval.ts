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
import { Contract } from "./contract";
import { User } from "./user";

@Entity({ name: "approval" })
@Index(["contract_id"], { unique: true })
@Index(["created_at"])
export class Approval extends BaseEntity {
  @Column({ type: "character varying", nullable: false })
  contract_id!: string;

  @ManyToOne(() => Contract)
  @JoinColumn({ name: "contract_id", referencedColumnName: "id" })
  contract?: Contract;

  @Column({ type: "character varying", nullable: false })
  approver_id!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "approver_id", referencedColumnName: "id" })
  approver?: User;

  @Column({ type: "timestamp with time zone", nullable: true })
  approved_at?: Date;

  @Column({ type: "timestamp with time zone", nullable: true })
  rejected_at?: Date;

  @Column({ type: "character varying", default: "pending" })
  status!: string; // 'pending' | 'approved' | 'rejected'

  @Column({ type: "jsonb", default: {} })
  metadata?: Record<string, unknown> | null;

  @BeforeInsert()
  protected BeforeInsert(): void {
    this.id = generateEntityId(this.id, "apv");
  }
}
