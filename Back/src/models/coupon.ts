import { BaseEntity } from "data-source";
import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from "typeorm";
import { generateEntityId } from "utils/functions";
import { Category } from "./category";
import { Group } from "./group";
import { LineItem } from "./line_item";
import { Order } from "./order";
import { Product } from "./product";
import { ShippingMethod } from "./shipping_method";
import { Store } from "./store";
import { User } from "./user";

/*
 * user_id가 없는 경우는 미리 작성된 쿠폰 형태
 * item_id : 상품 쿠폰 / order_id : 주문서 쿠폰 / shipping_method_id : 배송 쿠폰
 * CalcType : percent는 퍼센트 할인, fix는 고정값 할인
 * DateType : fixed는 고정일, starts_at과 ends_at 동일하게 복제, range는 획득일 기준으로 기간 range 및 DateUnit으로 계산,
 *            day는 당일로 starts_at과 ends_at은 시간만 영향 받게 생성, week는 해당 주 월요일~일요일, month는 1일부터 말일, year는 1월 1일부터 연말까지
 * Target : SIGNUP은 회원가입시, GROUP은 멤버쉽 월별 쿠폰(group_id 필수), LINK는 링크, ETC는 기타
 */
export enum CouponType {
  ITEM = "item",
  ORDER = "order",
  SHIPPING = "shipping",
}
export enum CalcType {
  PERCENT = "percent",
  FIX = "fix",
}
export enum DateType {
  FIXED = "fixed",
  RANGE = "range",
  DAY = "day",
  WEEK = "week",
  MONTH = "month",
  YEAR = "year",
}

export enum DateUnit {
  YEAR = "year",
  MONTH = "month",
  DATE = "date",
  HOURS = "hours",
}
export enum Target {
  MANUAL = "manual",
  CONDTION = "condition",
  INTERVAL = "interval",
  LINK = "link",
}
export enum Condition {
  SIGNUP = "signup",
  BIRTHDAY = "birthday",
  DATE = "date",
  REVIEW = "review",
  DELIVERY = "delivery",
  ORDER = "order",
  FIRST = "first",
  PURCHASE = "purchase",
}
@Entity({ name: "coupon" })
@Index(["created_at"])
// CREATE INDEX IF NOT EXISTS idx_coupon_id ON public.coupon USING GIN (fn_text_to_char_array(id));
// CREATE INDEX IF NOT EXISTS idx_coupon_name ON public.coupon USING GIN (fn_text_to_char_array(name));
export class Coupon extends BaseEntity {
  @Column({ type: "character varying", nullable: false })
  store_id?: string;

  @ManyToOne(() => Store)
  @JoinColumn({ name: "store_id", referencedColumnName: "id" })
  store?: Store;

  @Column({ type: "character varying", nullable: false })
  name?: string;

  @Column({ type: "enum", enum: Condition, nullable: true })
  condition?: Condition;

  @Column({ type: "enum", enum: CouponType, nullable: false })
  type!: CouponType;

  @Column({ type: "real", default: 0.0 })
  value!: number;

  @Column({ enum: CalcType, type: "enum", default: CalcType.FIX })
  calc!: CalcType;

  @Column({
    type: "timestamp with time zone",
    default: () => "CURRENT_TIMESTAMP",
    nullable: false,
  })
  appears_at?: Date | string;

  @Column({ enum: DateType, type: "enum", default: DateType.FIXED })
  date!: DateType;

  @Column({ type: "timestamp with time zone", nullable: true })
  starts_at?: Date | string | null;

  @Column({ type: "timestamp with time zone", nullable: true })
  ends_at?: Date | string | null;

  @Column({ type: "integer", default: 0 })
  range?: number;

  @Column({ enum: DateUnit, type: "enum", nullable: true })
  date_unit?: DateUnit;

  @Column({ type: "enum", enum: Target, default: Target.MANUAL })
  target?: Target;

  @Column({ type: "character varying", nullable: true })
  group_id?: string;

  @ManyToOne(() => Group)
  @JoinColumn({ name: "group_id", referencedColumnName: "id" })
  group?: Group;

  @Column({
    type: "timestamp with time zone",
    nullable: true,
  })
  issue_date?: Date | string | null;
  @Column({ type: "boolean", default: false })
  issue_lunar?: boolean;

  @Column({ type: "integer", default: 0 })
  review_min?: number;

  @Column({ type: "boolean", default: false })
  review_photo?: boolean;

  @Column({ type: "integer", default: -1 })
  max_quantity?: number;

  @Column({ type: "integer", default: 0 })
  quantity?: number;

  @Column({ type: "integer", default: 0 })
  duplicate?: number;

  @Column({ type: "integer", default: -1 })
  total_min?: number;
  @Column({ type: "integer", default: -1 })
  total_max?: number;

  @Column({
    type: "timestamp with time zone",
    nullable: true,
  })
  order_starts_at?: Date | string | null;

  @Column({
    type: "timestamp with time zone",
    nullable: true,
  })
  order_ends_at?: Date | string | null;

  @Column({ type: "character varying", nullable: true })
  buy_type?: string;

  @Column({ type: "integer", default: -1 })
  buy_min?: number;

  @Column({ type: "character varying", nullable: true })
  code?: string;

  @Column({ type: "integer", nullable: true })
  interval?: number;

  // 발급된 경우 데이터
  @Column({ type: "character varying", nullable: true })
  user_id?: string;

  @ManyToOne(() => User, (user) => user.coupons)
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  user?: User;

  @Column({ type: "character varying", nullable: true })
  origin_id?: string;

  @ManyToOne(() => Coupon)
  @JoinColumn({ name: "origin_id", referencedColumnName: "id" })
  origin?: Coupon;

  // 사용 관련
  @Column({ type: "character varying", nullable: true })
  item_id?: string;

  @ManyToOne(() => LineItem, (item) => item.coupons)
  @JoinColumn({ name: "item_id", referencedColumnName: "id" })
  item?: LineItem;

  @Column({ type: "character varying", nullable: true })
  order_id?: string;

  @ManyToOne(() => Order, (order) => order.coupons)
  @JoinColumn({ name: "order_id", referencedColumnName: "id" })
  order?: Order;

  @Column({ type: "character varying", nullable: true })
  shipping_method_id?: string;

  @ManyToOne(() => ShippingMethod, (shipping_method) => shipping_method.coupons)
  @JoinColumn({ name: "shipping_method_id", referencedColumnName: "id" })
  shipping_method?: ShippingMethod;

  @ManyToMany(() => Product)
  @JoinTable({
    name: "coupon_product",
    joinColumn: {
      name: "coupon_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "product_id",
      referencedColumnName: "id",
    },
  })
  products?: Product[];

  @ManyToMany(() => Category)
  @JoinTable({
    name: "coupon_category",
    joinColumn: {
      name: "coupon_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "category_id",
      referencedColumnName: "id",
    },
  })
  categories?: Category[];

  get used(): boolean {
    return !!(this.item_id || this.order_id || this.shipping_method_id);
  }
  @Column({ type: "jsonb", default: {} })
  metadata?: Record<string, unknown> | null;

  @BeforeInsert()
  protected BeforeInsert(): void {
    this.id = generateEntityId(this.id, "cup");
  }
  toJSON() {
    const result = {
      ...this,
      used: this.used,
    };
    return result;
  }
}
