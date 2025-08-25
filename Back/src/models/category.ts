import { BaseTreeEntity } from "data-source";
import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Tree,
  TreeChildren,
  TreeParent,
} from "typeorm";
import { generateEntityId } from "utils/functions";

@Tree("materialized-path")
@Entity({ name: "category" })
@Index(["created_at"])
// CREATE INDEX idx_category_name ON public.category USING GIN (fn_text_to_char_array(name));
export class Category extends BaseTreeEntity {
  @ManyToOne(() => Category, (entity) => entity.children, {
    nullable: true,
  })
  @TreeParent()
  @JoinColumn({ name: "parent_id", referencedColumnName: "id" })
  parent?: Category;

  @OneToMany(() => Category, (entity) => entity.parent)
  @TreeChildren({ cascade: ["insert", "update"] })
  children?: Category[];

  @Column({ type: "character varying", nullable: false })
  store_id?: string;

  @Column({ type: "character varying", nullable: false })
  name?: string;

  @Column({ type: "character varying", nullable: true })
  thumbnail?: string;

  @Column({ type: "jsonb", default: {} })
  metadata?: Record<string, unknown> | null;

  // @Column({ type: "character varying", nullable: true })
  // mpath?: string;

  @BeforeInsert()
  protected async BeforeInsert(): Promise<void> {
    this.id = generateEntityId(this.id, "cat");
  }
}
