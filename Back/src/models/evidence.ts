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

@Entity({ name: "evidence" })
@Index(["contract_id"], { unique: true })
@Index(["file_bucket", "file_key"], { unique: true })
@Index(["created_at"])
export class Evidence extends BaseEntity {
  @Column({ type: "character varying", nullable: false })
  contract_id!: string;

  @ManyToOne(() => Contract)
  @JoinColumn({ name: "contract_id", referencedColumnName: "id" })
  contract?: Contract;

  @Column({ type: "character varying", nullable: false })
  file_bucket!: string;

  @Column({ type: "character varying", nullable: false })
  file_key!: string;

  @Column({ type: "character varying", nullable: true })
  file_name?: string;

  @Column({ type: "jsonb", default: {} })
  metadata?: Record<string, unknown> | null;

  @BeforeInsert()
  protected BeforeInsert(): void {
    this.id = generateEntityId(this.id, "evd");
  }
}
