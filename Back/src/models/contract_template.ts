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
import { Store } from "./store";

@Entity({ name: "contract_template" })
@Index(["store_id"])
@Index(["created_at"])
export class ContractTemplate extends BaseEntity {
  @Column({ type: "character varying", nullable: false })
  store_id!: string;

  @ManyToOne(() => Store)
  @JoinColumn({ name: "store_id", referencedColumnName: "id" })
  store?: Store;

  @Column({ type: "character varying", nullable: false })
  name!: string; // 템플릿 이름

  @Column({ type: "text", nullable: false })
  body!: string; // 계약서 기본 본문

  @Column({ type: "jsonb", default: {} })
  variables?: Record<string, unknown> | null; // 변수 정의용

  @Column({ type: "boolean", default: false })
  default?: boolean; // 기본 템플릿 여부

  @Column({ type: "boolean", default: false })
  locked?: boolean;

  @Column({ type: "jsonb", default: {} })
  metadata?: Record<string, unknown> | null;

  @BeforeInsert()
  protected BeforeInsert(): void {
    this.id = generateEntityId(this.id, "tpl");
  }
}
