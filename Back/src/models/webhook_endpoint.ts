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

@Entity({ name: "webhook_endpoint" })
@Index(["store_id"])
@Index(["store_id", "url"], { unique: true })
@Index(["created_at"])
export class WebhookEndpoint extends BaseEntity {
  @Column({ type: "character varying", nullable: false })
  store_id!: string;

  @ManyToOne(() => Store)
  @JoinColumn({ name: "store_id", referencedColumnName: "id" })
  store?: Store;

  @Column({ type: "character varying", nullable: false })
  url!: string;

  @Column({ type: "character varying", nullable: true })
  secret?: string;

  @Column({ type: "boolean", default: true })
  active?: boolean;

  @Column({ type: "jsonb", default: {} })
  metadata?: Record<string, unknown> | null;

  @BeforeInsert()
  protected BeforeInsert(): void {
    this.id = generateEntityId(this.id, "whk");
  }
}
