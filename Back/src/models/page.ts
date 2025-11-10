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
import { Contract } from "./contract";
import { InputField } from "./input_field";

@Entity({ name: "page" })
@Index(["created_at"])
export class Page extends BaseEntity {
  @Column({ type: "character varying", nullable: true })
  contract_id?: string;

  @ManyToOne(() => Contract, (contract) => contract.pages, { nullable: true })
  @JoinColumn({ name: "contract_id", referencedColumnName: "id" })
  contract?: Contract;

  @Column({ type: "character varying" })
  image!: string;

  @Column({ type: "integer", nullable: true })
  page?: number;

  @OneToMany(() => InputField, (field) => field.page)
  input_fields?: InputField[];

  @BeforeInsert()
  protected BeforeInsert(): void {
    this.id = generateEntityId(this.id, "pag");
  }
}
