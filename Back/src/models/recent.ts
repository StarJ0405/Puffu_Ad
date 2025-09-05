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
import { Product } from "./product";
import { User } from "./user";

@Entity({ name: "recent" })
@Index(["created_at", "user_id"])
export class Recent extends BaseEntity {
  @Column({ type: "character varying", nullable: true })
  user_id?: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  user?: User;

  @Column({ type: "character varying", nullable: true })
  product_id?: string;

  @ManyToOne(() => Product)
  @JoinColumn({ name: "product_id", referencedColumnName: "id" })
  product?: Product;

  @Column({ type: "jsonb", default: {} })
  metadata?: Record<string, unknown> | null;

  @BeforeInsert()
  protected async BeforeInsert(): Promise<void> {
    this.id = generateEntityId(this.id, "rec");
  }
}
