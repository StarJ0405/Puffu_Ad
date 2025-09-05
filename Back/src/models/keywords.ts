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
import { User } from "./user";

@Entity({ name: "keywords" })
@Index(["created_at"])
// CREATE INDEX IF NOT EXISTS idx_keywords_keyword ON public.keywords USING GIN (fn_text_to_char_array(keyword));
export class Keywords extends BaseEntity {
  @Column({ type: "character varying", nullable: true })
  user_id?: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  user?: User;

  @Column({ type: "character varying", nullable: true })
  store_id?: string;

  @ManyToOne(() => Store)
  @JoinColumn({ name: "store_id", referencedColumnName: "id" })
  store?: Store;

  @Column({ type: "character varying", nullable: false })
  keyword?: string;

  @Column({ type: "jsonb", default: {} })
  metadata?: Record<string, unknown> | null;

  @BeforeInsert()
  protected async BeforeInsert(): Promise<void> {
    this.id = generateEntityId(this.id, "key");
  }
}
