import { BaseEntity } from "data-source";
import { BeforeInsert, Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { generateEntityId } from "utils/functions";
import { Contract } from "./contract";

@Entity({ name: "contract_version" })
@Index(["contract_id"])
@Index(["v_no"])
@Index(["created_at"])
export class ContractVersion extends BaseEntity {
  @Column({ type: "character varying", nullable: false })
  contract_id!: string;

  @ManyToOne(() => Contract)
  @JoinColumn({ name: "contract_id", referencedColumnName: "id" })
  contract?: Contract;

  @Column({ type: "integer", nullable: false })
  v_no!: number;

  @Column({ type: "text", nullable: true })
  body?: string;

  @Column({ type: "jsonb", default: {} })
  variables?: Record<string, unknown> | null;

  @Column({ type: "boolean", default: false })
  locked?: boolean;

  @BeforeInsert()
  protected BeforeInsert(): void {
    this.id = generateEntityId(this.id, "cov");
  }
}
