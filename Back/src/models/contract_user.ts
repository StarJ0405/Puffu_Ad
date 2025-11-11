import { BaseEntity } from "data-source";
import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import { generateEntityId } from "utils/functions";
import { Contract } from "./contract";

export enum ApproveStatus {
  PENDING = "pending",
  READY = "ready",
  CONFIRM = "confirm",
}

@Entity({ name: "contract_user" })
export class ContractUser extends BaseEntity {
  @Column({ type: "character varying" })
  name!: string;

  @Column({ type: "character varying", nullable: true })
  user_id?: string | null;

  @Column({
    type: "enum",
    enum: ApproveStatus,
    default: ApproveStatus.PENDING,
  })
  approve!: ApproveStatus;

  @Column({ type: "character varying" })
  contract_id!: string;

  @ManyToOne(() => Contract, (contract) => contract.contract_users, { onDelete: "CASCADE" })
  @JoinColumn({ name: "contract_id", referencedColumnName: "id" })
  contract!: Contract;

  @BeforeInsert()
  protected BeforeInsert(): void {
    this.id = generateEntityId(this.id, "cus");
  }
}
