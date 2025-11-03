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
import { WebhookEndpoint } from "./webhook_endpoint";

@Entity({ name: "outbox" })
@Index(["event_id", "endpoint_id"], { unique: true })
@Index(["created_at"])
export class Outbox extends BaseEntity {
  @Column({ type: "character varying", nullable: false })
  event_id!: string;

  @Column({ type: "character varying", nullable: false })
  endpoint_id!: string;

  @ManyToOne(() => WebhookEndpoint)
  @JoinColumn({ name: "endpoint_id", referencedColumnName: "id" })
  endpoint?: WebhookEndpoint;

  @Column({ type: "jsonb", default: {} })
  payload!: Record<string, unknown>;

  @Column({ type: "character varying", default: "pending" })
  status!: "pending" | "success" | "failed";

  @Column({ type: "integer", default: 0 })
  retry_count?: number;

  @Column({ type: "timestamp with time zone", nullable: true })
  last_attempt_at?: Date;

  @Column({ type: "text", nullable: true })
  last_error?: string;

  @BeforeInsert()
  protected BeforeInsert(): void {
    this.id = generateEntityId(this.id, "out");
  }
}
