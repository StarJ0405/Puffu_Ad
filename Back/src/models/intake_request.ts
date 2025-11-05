import { BaseEntity } from "data-source";
import {
  BeforeInsert,
  Column,
  Entity,
  Index,
} from "typeorm";
import { generateEntityId } from "utils/functions";

@Entity({ name: "intake_request" })
@Index(["created_at"])
@Index(["store_id"])
@Index(["email"])
@Index(["status"])
export class IntakeRequest extends BaseEntity {
  @Column({ type: "character varying", nullable: false })
  store_id!: string;

  @Column({ type: "character varying", nullable: false })
  email!: string;

  @Column({ type: "character varying", nullable: true })
  token?: string;

  @Column({ type: "timestamptz", nullable: true })
  expires_at?: Date;

  @Column({ type: "character varying", default: "pending" })
  status!: "pending" | "submitted" | "expired";

  @Column({ type: "jsonb", default: {} })
  metadata?: Record<string, any>;

  @BeforeInsert()
  protected beforeInsert() {
    this.id = generateEntityId(this.id, "intk");
    this.token = Math.random().toString(36).substring(2, 12);
  }
}
