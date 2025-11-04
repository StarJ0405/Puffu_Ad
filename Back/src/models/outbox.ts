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
import { Store } from "./store";

@Entity({ name: "outbox" })
@Index(["store_id"])
@Index(["endpoint_id"])
@Index(["event_id"], { unique: true })
@Index(["created_at"])
export class Outbox extends BaseEntity {
  @Column({ type: "character varying", nullable: false })
  store_id!: string;

  @ManyToOne(() => Store)
  @JoinColumn({ name: "store_id", referencedColumnName: "id" })
  store?: Store;

  @Column({ type: "character varying", nullable: false })
  endpoint_id!: string;

  @ManyToOne(() => WebhookEndpoint)
  @JoinColumn({ name: "endpoint_id", referencedColumnName: "id" })
  endpoint?: WebhookEndpoint;

  @Column({ type: "character varying", nullable: false })
  event_id!: string; // 내부 이벤트 ID

  @Column({ type: "character varying", nullable: false })
  event_type!: string; // 예: contract.created, approval.approved

  @Column({ type: "jsonb", default: {} })
  payload!: Record<string, unknown>; // 전송할 데이터

  @Column({ type: "character varying", default: "pending" })
  status!: string; // pending | success | failed

  @Column({ type: "integer", default: 0 })
  attempts!: number; // 재시도 횟수

  @Column({ type: "timestamp with time zone", nullable: true })
  sent_at?: Date;

  @Column({ type: "jsonb", default: {} })
  response?: Record<string, unknown> | null;

  @BeforeInsert()
  protected BeforeInsert(): void {
    this.id = generateEntityId(this.id, "out");
  }
}
