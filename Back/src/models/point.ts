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
import { User } from "./user";

@Entity({ name: "point" })
@Index(["created_at"])
export class Point extends BaseEntity {
  @Column({ type: "character varying", nullable: false })
  user_id?: string;

  @ManyToOne(() => User, (user) => user.points)
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  user?: User;

  @Column({ type: "real", nullable: false, default: 0 })
  point!: number;

  @Column({ type: "real", nullable: false, default: 0 })
  used_point!: number;

  @Column({ type: "timestamp with time zone", nullable: true })
  ends_at?: Date | null;

  @Column({ type: "jsonb", default: {} })
  metadata?: Record<string, unknown> | null;

  @BeforeInsert()
  protected async BeforeInsert(): Promise<void> {
    this.id = generateEntityId(this.id, "pt");
  }
}
