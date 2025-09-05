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
import { LineItem } from "./line_item";
import { Order } from "./order";
import { Product } from "./product";
import { User } from "./user";

@Entity({ name: "review" })
@Index(["created_at"])
// CREATE INDEX IF NOT EXISTS idx_review_content ON public.review USING GIN (fn_text_to_char_array(content));
export class Review extends BaseEntity {
  @Column({ type: "character varying", nullable: true })
  item_id?: string;

  @ManyToOne(() => LineItem)
  @JoinColumn({ name: "item_id", referencedColumnName: "id" })
  item?: LineItem;

  @Column({ type: "character varying", nullable: false })
  user_id?: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  user?: User;

  @Column({ type: "text", nullable: false })
  content?: string;

  @Column({ array: true, type: "character varying", default: [] })
  images?: string[];

  @Column({ type: "jsonb", default: {} })
  metadata?: Record<string, unknown> | null;

  @BeforeInsert()
  protected async BeforeInsert(): Promise<void> {
    this.id = generateEntityId(this.id, "rvw");
  }
}
