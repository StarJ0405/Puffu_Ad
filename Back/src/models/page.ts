import { BaseEntity } from "data-source";
import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { generateEntityId } from "utils/functions";
import { Contract } from "./contract";
import { InputField } from "./input_field";

@Entity({ name: "page" })
export class Page extends BaseEntity {
  @Column({ type: "character varying" })
  image!: string;

  @Column({ type: "integer" })
  page!: number;

  @Column({ type: "character varying" })
  contract_id!: string;

  @ManyToOne(() => Contract, (contract) => contract.pages, { onDelete: "CASCADE" })
  @JoinColumn({ name: "contract_id", referencedColumnName: "id" })
  contract!: Contract;

  @OneToMany(() => InputField, (field) => field.page, {
    cascade: ["insert", "update"],
    orphanedRowAction: "soft-delete",
  })
  input_fields?: InputField[];

  @BeforeInsert()
  protected BeforeInsert(): void {
    this.id = generateEntityId(this.id, "pag");
  }
}
