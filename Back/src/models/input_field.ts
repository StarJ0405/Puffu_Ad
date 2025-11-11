import { BaseEntity } from "data-source";
import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import { generateEntityId } from "utils/functions";
import { Page } from "./page";

@Entity({ name: "input_field" })
export class InputField extends BaseEntity {
  @Column({ type: "character varying" })
  page_id!: string;

  @ManyToOne(() => Page, (page) => page.input_fields, { onDelete: "CASCADE" })
  @JoinColumn({ name: "page_id", referencedColumnName: "id" })
  page!: Page;

  @Column({ type: "character varying" })
  type!: string;

  @Column({ type: "jsonb", default: {} })
  metadata!: Record<string, any>;

  @Column({ type: "jsonb", default: {} })
  value!: Record<string, any>;

  @BeforeInsert()
  protected BeforeInsert(): void {
    this.id = generateEntityId(this.id, "fld");
  }
}
