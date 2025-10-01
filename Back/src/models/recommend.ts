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
import { Review } from "./review";
import { User } from "./user";

@Entity({ name: "recommend" })
@Index(["created_at", "user_id"])
@Unique("user-review", ["user_id", "review_id"])
export class Recommend extends BaseEntity {
  @Column({ type: "character varying", nullable: true })
  user_id?: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  user?: User;

  @Column({ type: "character varying", nullable: true })
  review_id?: string;

  @ManyToOne(() => Review, (review) => review.recommends, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "review_id", referencedColumnName: "id" })
  review?: Review;

  @Column({ type: "jsonb", default: {} })
  metadata?: Record<string, unknown> | null;

  @BeforeInsert()
  protected async BeforeInsert(): Promise<void> {
    this.id = generateEntityId(this.id, "rec");
  }
}
