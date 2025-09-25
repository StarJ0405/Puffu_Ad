import { BaseEntity } from "data-source";
import { BeforeInsert, Column, Entity, Index, OneToMany } from "typeorm";
import { generateEntityId } from "utils/functions";
import { User } from "./user";

@Entity({ name: "group" })
@Index(["created_at"])
// CREATE INDEX IF NOT EXISTS idx_group_name ON public.group USING GIN (fn_text_to_char_array(name));
export class Group extends BaseEntity {
  @Column({ type: "character varying", nullable: false })
  name?: string;

  @Column({ type: "character varying", nullable: true })
  thumbnail?: string;

  @Column({ type: "integer", default: 0 })
  min?: number;

  @Column({ type: "real", default: 0.0 })
  percent?: number;

  @Column({ type: "jsonb", default: {} })
  metadata?: Record<string, unknown> | null;

  @OneToMany(() => User, (user) => user.group)
  users?: User[];

  @BeforeInsert()
  protected async BeforeInsert(): Promise<void> {
    this.id = generateEntityId(this.id, "grp");
  }
}
