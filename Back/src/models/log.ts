import { BaseEntity } from "data-source";
import { BeforeInsert, Column, Entity, Index } from "typeorm";
import { generateEntityId } from "utils/functions";

@Entity({ name: "log" })
@Index(["created_at"])
// CREATE INDEX IF NOT EXISTS idx_log_name ON public.log USING GIN (fn_text_to_char_array(name));
// CREATE INDEX IF NOT EXISTS idx_log_type ON public.log USING GIN (fn_text_to_char_array(type));
export class Log extends BaseEntity {
  @Column({ type: "character varying", nullable: false })
  name?: string;

  @Column({ type: "character varying", nullable: false })
  type?: string;

  @Column({ type: "jsonb", default: {} })
  data?: Record<string, unknown> | null;

  @Column({ type: "jsonb", default: {} })
  metadata?: Record<string, unknown> | null;

  @BeforeInsert()
  protected async BeforeInsert(): Promise<void> {
    this.id = generateEntityId(this.id, "log");
  }
}
