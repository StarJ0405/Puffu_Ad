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
import { BundleVaraint } from "./bundle-variant";
import { Event } from "./event";
import { BundleProduct } from "./bundle-product";

@Entity({ name: "event_bundle" })
@Index(["created_at"])
export class EventBundle extends BaseEntity {
  @Column({ type: "character varying", nullable: false })
  name?: string;

  @Column({ type: "character varying", nullable: false })
  event_id?: string;

  @ManyToOne(() => Event, (event) => event.bundles)
  @JoinColumn({ name: "event_id", referencedColumnName: "id" })
  event?: Event;

  @Column({ type: "integer", default: 0, nullable: false })
  N!: number;

  @Column({ type: "integer", default: 0, nullable: false })
  M!: number;

  @Column({ type: "jsonb", default: {} })
  metadata?: Record<string, unknown> | null;

  @OneToMany(() => BundleProduct, (bp) => bp.bundle, {
    cascade: ["insert", "update"],
    orphanedRowAction: "soft-delete",
  })
  products?: BundleProduct[];

  @OneToMany(() => BundleVaraint, (bv) => bv.bundle, {
    cascade: ["insert", "update"],
    orphanedRowAction: "soft-delete",
  })
  variants?: BundleVaraint[];

  @BeforeInsert()
  protected async BeforeInsert(): Promise<void> {
    this.id = generateEntityId(this.id, "bud");
  }
}
