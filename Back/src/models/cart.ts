import { BaseEntity } from "data-source";
import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { generateEntityId } from "utils/functions";
import { LineItem } from "./line_item";
import { Store } from "./store";
import { User } from "./user";

@Entity({ name: "cart" })
@Index(["created_at"])
export class Cart extends BaseEntity {
  @Column({ type: "character varying", nullable: false })
  user_id?: string;

  @ManyToOne(() => User, (user) => user.carts)
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  user?: User;

  @Column({ type: "character varying", nullable: false })
  store_id?: string;

  @ManyToOne(() => Store)
  @JoinColumn({ name: "store_id", referencedColumnName: "id" })
  store?: Store;

  @Column({ type: "character varying", nullable: true })
  type?: string;

  @OneToMany(() => LineItem, (item) => item.cart)
  items?: LineItem[];

  @Column({ type: "jsonb", default: {} })
  metadata?: Record<string, unknown> | null;

  @BeforeInsert()
  protected async BeforeInsert(): Promise<void> {
    this.id = generateEntityId(this.id, "crt");
  }
}
