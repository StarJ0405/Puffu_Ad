import { BaseEntity } from "data-source";
import { BeforeInsert, Column, Entity, Index, OneToMany } from "typeorm";
import { generateEntityId } from "utils/functions";
import { AccountLink } from "./account_link";
import { Cart } from "./cart";
import { Order } from "./order";

export enum UserRole {
  ADMIN = "admin",
  VENDOR = "vendor",
  MEMBER = "member",
  DEVELOPER = "developer",
}

@Entity({ name: "user" })
@Index(["created_at"])
// CREATE INDEX idx_user_id ON public.user USING GIN (fn_text_to_char_array(id));
// CREATE INDEX idx_user_username ON public.user USING GIN (fn_text_to_char_array(username));
// CREATE INDEX idx_user_name ON public.user USING GIN (fn_text_to_char_array(name));
// CREATE INDEX idx_user_phone ON public.user USING GIN (fn_text_to_char_array(phone));
// CREATE INDEX idx_user_nickname ON public.user USING GIN (fn_text_to_char_array(nickname));
export class User extends BaseEntity {
  @Column({ type: "character varying", unique: true })
  username?: string;

  @Column({ type: "character varying" })
  password_hash?: string;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.MEMBER,
  })
  role?: UserRole;

  @Column({ type: "character varying", nullable: true })
  name?: string;

  @Column({ type: "character varying", nullable: true })
  phone?: string;

  @Column({ type: "character varying", nullable: true })
  thumbnail?: string;

  @Column({ type: "character varying", nullable: true })
  nickname?: string;

  @Column({ type: "timestamp with time zone", nullable: true })
  birthday?: Date;

  get adult(): boolean {
    if (this.birthday) {
      return (
        new Date().getFullYear() - new Date(this.birthday).getFullYear() > 19
      );
    }
    return false;
  }
  @Column({ type: "character varying", nullable: true })
  brand_id?: string;

  @Column({ type: "character varying", nullable: true })
  ci?: string;

  @Column({ type: "character varying", nullable: true })
  di?: string;

  @Column({ type: "character varying", nullable: true })
  biometric_algorithm?: string;

  @Column({ type: "character varying", nullable: true })
  biometric_enabled?: string;

  @Column({ type: "character varying", nullable: true })
  biometric_public_key?: string;

  @Column({
    type: "timestamp with time zone",
    nullable: true,
  })
  biometric_registered_at?: Date;

  @Column({ type: "character varying", nullable: true })
  pin_hash?: string;

  @Column({ type: "boolean", default: false })
  adult_mode?: boolean;

  @Column({ type: "jsonb", default: {} })
  metadata?: Record<string, unknown> | null;

  @OneToMany(() => AccountLink, (link) => link.user)
  accounts?: AccountLink[];

  @OneToMany(() => Order, (order) => order.user)
  orders?: Order[];

  @OneToMany(() => Cart, (cart) => cart.user)
  carts?: Cart[];

  @BeforeInsert()
  protected BeforeInsert(): void {
    this.id = generateEntityId(this.id, "usr");
  }
  toJSON() {
    return {
      ...this,
      adult: this.adult,
    };
  }
}
