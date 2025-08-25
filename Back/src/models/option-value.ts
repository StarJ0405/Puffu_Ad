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
import { Option } from "./option";
import { Variant } from "./variant";

@Entity({ name: "option_value" })
@Index(["created_at"])
export class OptionValue extends BaseEntity {
  @Column({ type: "character varying", nullable: false })
  option_id?: string;

  @ManyToOne(() => Option, (option) => option.values)
  @JoinColumn({ name: "option_id", referencedColumnName: "id" })
  option?: Option;

  @Column({ type: "character varying", nullable: false })
  variant_id?: string;

  @ManyToOne(() => Variant, (variant) => variant.values)
  @JoinColumn({ name: "variant_id", referencedColumnName: "id" })
  variant?: Variant;

  @Column({ type: "character varying", nullable: false, default: "default" })
  value?: string;

  @Column({ type: "jsonb", default: {} })
  metadata?: Record<string, unknown> | null;

  @BeforeInsert()
  protected async BeforeInsert(): Promise<void> {
    this.id = generateEntityId(this.id, "ov");
  }
}
