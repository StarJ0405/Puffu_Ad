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

@Entity({ name: "banner" })
@Index(["created_at"])
@Index(["store_id", "importance"])
// CREATE INDEX IF NOT EXISTS idx_banner_name ON public.banner USING GIN (fn_text_to_char_array(name));
export class Banner extends BaseEntity {
  @Column({ type: "character varying", nullable: false })
  name?: string;

  @Column({ type: "character varying", nullable: false })
  store_id?: string;

  @ManyToOne(() => Store)
  @JoinColumn({ name: "store_id", referencedColumnName: "id" })
  store?: Store;

  @Column({ type: "jsonb", default: {}, nullable: false })
  thumbnail?: Record<string, unknown> | null;

  @Column({ type: "character varying", nullable: true })
  to?: string | null;

  @Column({ type: "timestamp with time zone", nullable: true })
  starts_at?: Date | string;

  @Column({ type: "timestamp with time zone", nullable: true })
  ends_at?: Date | string;

  @Column({ type: "boolean", default: false })
  adult?: boolean;

  @Column({ type: "boolean", default: true })
  visible?: boolean;

  @Column({ type: "integer", nullable: false, default: 0 })
  importance!: number;

  @Column({ type: "jsonb", default: {} })
  metadata?: Record<string, unknown> | null;

  @BeforeInsert()
  protected async BeforeInsert(): Promise<void> {
    this.id = generateEntityId(this.id, "bnn");
  }
}
