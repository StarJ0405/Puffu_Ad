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
import { Product } from "./product";
import { User } from "./user";

export enum QARole {
  ETC = "etc",
  EXCHANGE = "exchange",
  REFUND = "refund",
}

@Entity({ name: "qa" })
@Index(["created_at"])
// CREATE INDEX IF NOT EXISTS idx_qa_title ON public.qa USING GIN (fn_text_to_char_array(title));
// CREATE INDEX IF NOT EXISTS idx_qa_type ON public.qa USING GIN (fn_text_to_char_array(type));
// CREATE INDEX IF NOT EXISTS idx_qa_content ON public.qa USING GIN (fn_text_to_char_array(content));
export class QA extends BaseEntity {
  @Column({ enum: QARole, type: "enum", nullable: false, default: QARole.ETC })
  type!: QARole;

  @Column({ type: "character varying", nullable: false })
  category?: string;

  @Column({ type: "character varying", nullable: false })
  title?: string;

  @Column({ type: "character varying", nullable: true })
  product_id?: string;

  @ManyToOne(() => Product)
  @JoinColumn({ name: "product_id", referencedColumnName: "id" })
  product?: Product;

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

  @Column({ type: "text", nullable: true })
  answer?: string;

  @Column({ type: "boolean", default: false })
  hidden?: boolean;

  @Column({ array: true, type: "character varying", default: [] })
  images?: string[];

  @Column({ type: "jsonb", default: {} })
  metadata?: Record<string, unknown> | null;

  @BeforeInsert()
  protected async BeforeInsert(): Promise<void> {
    this.id = generateEntityId(this.id, "qa");
  }
}
