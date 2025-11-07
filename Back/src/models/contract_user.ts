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
import { Contract } from "./contract";
import { User } from "./user";

export enum ApproveStatus {
  PENDING = "pending",
  READY = "ready",
  CONFIRM = "confirm",
}

@Entity({ name: "contract_user" })
@Index(["created_at"])
export class ContractUser extends BaseEntity {
  @Column({ type: "character varying" })
  name!: string;

  @Column({ type: "character varying", nullable: true })
  user_id?: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  user?: User;

  @Column({ type: "character varying", nullable: true })
  contract_id?: string;

  @ManyToOne(() => Contract, (contract) => contract.contract_users, {
    nullable: true,
  })
  @JoinColumn({ name: "contract_id", referencedColumnName: "id" })
  contract?: Contract;

  @Column({
    type: "enum",
    enum: ApproveStatus,
    default: ApproveStatus.PENDING,
  })
  approve!: ApproveStatus;

  @BeforeInsert()
  protected BeforeInsert(): void {
    this.id = generateEntityId(this.id, "ctu");
  }
}
