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

  // 자기 자신(contract.id) 참조 (템플릿 기반 계약 생성용)
  @Column({ type: "character varying", nullable: true })
  origin_id?: string | null;

  @ManyToOne(() => Contract, (contract) => contract.children, { nullable: true })
  @JoinColumn({ name: "origin_id", referencedColumnName: "id" })
  origin?: Contract | null;

  @OneToMany(() => Contract, (contract) => contract.origin)
  children?: Contract[];

  @Column({ type: "timestamp with time zone", nullable: true })
  completed_at?: Date | string | null;

  @Column({ type: "timestamp with time zone", nullable: true })
  is_delete?: Date | string | null;

  // 페이지
  @OneToMany(() => Page, (page) => page.contract, {
    cascade: ["insert", "update"],
    orphanedRowAction: "soft-delete",
  })
  pages?: Page[];

  // 참여자 슬롯 (템플릿 생성 시 자리)
  @OneToMany(() => ContractUser, (cu) => cu.contract, {
    cascade: ["insert", "update"],
    orphanedRowAction: "soft-delete",
  })
  contract_users?: ContractUser[];

  @BeforeInsert()
  protected BeforeInsert(): void {
    this.id = generateEntityId(this.id, "ctr");
  }
}
