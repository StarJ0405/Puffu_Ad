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

@Entity({ name: "notice" })
@Index(["created_at"])
// CREATE INDEX IF NOT EXISTS idx_notice_title ON public.notice USING GIN (fn_text_to_char_array(title));
export class Notice extends BaseEntity {
  @Column({ type: "character varying", nullable: false })
  title?: string;

  @Column({ type: "character varying", nullable: true })
  thumbnail?: string;

  @Column({ type: "text", nullable: true })
  detail?: string;

  @Column({ type: "character varying", nullable: false })
  store_id?: string;

  @ManyToOne(() => Store)
  @JoinColumn({ name: "store_id", referencedColumnName: "id" })
  store?: Store;

  @Column({ type: "character varying", nullable: false })
  type?: string;

  @Column({ type: "timestamp with time zone", nullable: true })
  starts_at?: Date | string;

  @Column({ type: "timestamp with time zone", nullable: true })
  ends_at?: Date | string;

  @Column({ type: "boolean", default: false })
  adult?: boolean;

  @Column({ type: "boolean", default: true })
  visible?: boolean;

  @Column({ type: "jsonb", default: {} })
  metadata?: Record<string, unknown> | null;

  @BeforeInsert()
  protected async BeforeInsert(): Promise<void> {
    this.id = generateEntityId(this.id, "not");
  }
}
