import { BaseEntity } from "data-source";
import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  Unique,
} from "typeorm";
import { generateEntityId } from "utils/functions";
import { User } from "./user";

@Entity({ name: "connect_code" })
@Index(["created_at"])
@Unique("code-appid", ["appid", "code"])
export class ConnectCode extends BaseEntity {
  @Column({ type: "character varying", nullable: false })
  user_id?: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  user?: User;

  @Column({ type: "character varying", nullable: false })
  appid?: string;

  @Column({ type: "character varying", nullable: false })
  code?: string;

  @Column({ type: "timestamp with time zone", nullable: false })
  expires_at?: Date;

  @Column({ type: "jsonb", default: {} })
  metadata?: Record<string, unknown> | null;

  @BeforeInsert()
  protected async BeforeInsert(): Promise<void> {
    this.id = generateEntityId(this.id, "ccd");
  }
}
