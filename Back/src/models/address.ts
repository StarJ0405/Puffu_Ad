import { BaseEntity } from "data-source";
import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from "typeorm";
import { generateEntityId } from "utils/functions";
import { Order } from "./order";
import { User } from "./user";

@Entity({ name: "address" })
@Index(["created_at"])
export class Address extends BaseEntity {
  @Column({ type: "character varying", nullable: true })
  user_id?: string | null;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  user?: User;

  @Column({ type: "character varying", nullable: true })
  order_id?: string;

  @OneToOne(() => Order, (order) => order.address)
  @JoinColumn({ name: "order_id", referencedColumnName: "id" })
  order?: Order;

  @Column({ type: "character varying", nullable: false })
  name?: string;

  @Column({ type: "character varying", nullable: false })
  phone?: string;

  @Column({ type: "character varying", nullable: false })
  address1?: string;

  @Column({ type: "character varying", nullable: false })
  address2?: string;

  @Column({ type: "character varying", nullable: false })
  postal_code?: string;

  @Column({ type: "character varying", nullable: true })
  message?: string;

  @Column({ type: "boolean", default: false })
  default?: boolean;

  @Column({ type: "jsonb", default: {} })
  metadata?: Record<string, unknown> | null;

  @BeforeInsert()
  protected async BeforeInsert(): Promise<void> {
    this.id = generateEntityId(this.id, "addr");
  }
}
