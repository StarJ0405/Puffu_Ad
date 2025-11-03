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

@Entity({ name: "tag_map" })
@Index(["contract_id", "tag"], { unique: true })
@Index(["created_at"])
export class TagMap extends BaseEntity {
  @Column({ type: "character varying", nullable: false })
  contract_id!: string;

  @ManyToOne(() => Contract)
  @JoinColumn({ name: "contract_id", referencedColumnName: "id" })
  contract?: Contract;

  @Column({ type: "character varying", nullable: false })
  tag!: string;

  @Column({ type: "jsonb", default: {} })
  metadata?: Record<string, unknown> | null;

  @BeforeInsert()
  protected BeforeInsert(): void {
    this.id = generateEntityId(this.id, "tag");
  }
}
