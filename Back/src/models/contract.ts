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
import { Page } from "./page";
import { ContractUser } from "./contract_user";

@Entity({ name: "contract" })
@Index(["created_at"])
export class Contract extends BaseEntity {
  @Column({ type: "character varying" })
  name!: string;

  // 자기 자신(contract.id) 참조 (self FK)
  @Column({ type: "character varying", nullable: true })
  origin_id?: string;

  @ManyToOne(() => Contract, (contract) => contract.children, { nullable: true })
  @JoinColumn({ name: "origin_id", referencedColumnName: "id" })
  origin?: Contract | null;

  @OneToMany(() => Contract, (contract) => contract.origin)
  children?: Contract[];

  // 완료 시각
  @Column({ type: "timestamp with time zone", nullable: true })
  completed_at?: Date | string | null;

  // 계약 삭제 시각 (origin_id != null인 경우에만 사용)
  @Column({ type: "timestamp with time zone", nullable: true })
  is_delete?: Date | string | null;

  // 페이지 (1:N)
  @OneToMany(() => Page, (page) => page.contract)
  pages?: Page[];

  // 계약 참여자 (1:N)
  @OneToMany(() => ContractUser, (cu) => cu.contract)
  contract_users?: ContractUser[];

  @BeforeInsert()
  protected BeforeInsert(): void {
    this.id = generateEntityId(this.id, "ctr");
  }
}
