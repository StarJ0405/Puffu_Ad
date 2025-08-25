import { BaseEntity } from "data-source";
import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { generateEntityId } from "utils/functions";
import { Product } from "./product";
import { OptionValue } from "./option-value";

@Entity({ name: "option" })
@Index(["created_at"])
export class Option extends BaseEntity {
  @Column({ type: "character varying", nullable: false })
  product_id?: string;

  @ManyToOne(() => Product, (product) => product.options)
  @JoinColumn({ name: "product_id", referencedColumnName: "id" })
  product?: Product;

  @Column({ type: "character varying", nullable: false })
  title?: string;

  @Column({ type: "jsonb", default: {} })
  metadata?: Record<string, unknown> | null;

  @OneToMany(() => OptionValue, (value) => value.option, {
    cascade: ["insert", "update"],
    orphanedRowAction: "soft-delete",
  })
  values?: OptionValue[];
  @BeforeInsert()
  protected async BeforeInsert(): Promise<void> {
    this.id = generateEntityId(this.id, "opt");
  }
}
