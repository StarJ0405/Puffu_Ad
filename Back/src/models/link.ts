import { BaseEntity } from "data-source";
import { BeforeInsert, Column, Entity, Index, Unique } from "typeorm";
import { generateEntityId } from "utils/functions";

@Entity({ name: "link" })
@Index(["code"])
@Unique("code_type", ["code", "type"])
export class Link extends BaseEntity {
  @Column({ type: "character varying", length: 24 })
  code?: string;

  @Column({ type: "character varying", nullable: true })
  type?: string;

  @Column({ type: "timestamp with time zone", nullable: true })
  start_date?: Date;

  @Column({ type: "timestamp with time zone", nullable: true })
  end_date?: Date;

  @Column({ type: "integer", default: 0 })
  chance?: number;

  @Column({ type: "jsonb", default: {} })
  data?: Record<string, unknown> | null;

  @Column({ type: "jsonb", default: {} })
  metadata?: Record<string, unknown> | null;

  @Column({ type: "boolean", default: false })
  auto_delete?: boolean;

  @BeforeInsert()
  protected async BeforeInsert(): Promise<void> {
    this.id = generateEntityId(this.id, "li");
  }
}
