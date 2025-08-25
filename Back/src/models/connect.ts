import { BaseEntity } from "data-source";
import { BeforeInsert, Column, Entity, Index } from "typeorm";
import { generateEntityId } from "utils/functions";

@Entity({ name: "connect" })
@Index(["created_at"])
export class Connect extends BaseEntity {
  @Column({ type: "character varying", nullable: false })
  name?: string;

  @Column({ type: "character varying", unique: true, length: 24 })
  appid?: string;

  @Column({ type: "character varying", nullable: true })
  secret?: string;

  @Column({ type: "character varying", array: true, default: {} })
  domains?: string[];

  @Column({ type: "character varying", nullable: true })
  query?: string;

  @Column({ type: "jsonb", default: {} })
  metadata?: Record<string, unknown> | null;

  @BeforeInsert()
  protected async BeforeInsert(): Promise<void> {
    this.id = generateEntityId(this.id, "con");
  }
}
