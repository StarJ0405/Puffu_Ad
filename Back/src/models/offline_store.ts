import { BaseEntity } from "data-source";
import { BeforeInsert, Column, Entity, Index } from "typeorm";
import { generateEntityId } from "utils/functions";

export enum OfflineStoreStatus {
  OPERATING = "operating",  // 영업중
  MAINTENANCE = "maintenance", // 점검중
  UNKNOWN = "unknown", // 예외
}

@Entity({ name: "offline_store" })
@Index(["created_at"])
export class OfflineStore extends BaseEntity {
  @Column({ type: "character varying", nullable: false }) // 지점명
  name!: string;

  @Column({ type: "character varying", nullable: false, unique: true }) // 매장 해당 키오스크 id
  kiosk_uuid!: string;

  @Column({   // 매장 상태 "영업중" || "점검중" || "예외"
    type: "enum",
    enum: OfflineStoreStatus,
    default: OfflineStoreStatus.UNKNOWN,
  })
  status!: OfflineStoreStatus;

  @Column({ type: "character varying", nullable: true }) // 위도
  lat?: string;

  @Column({ type: "character varying", nullable: true }) // 경도
  lng?: string;

  @Column({ type: "character varying", nullable: true }) // 주소
  address?: string | null;

  @Column({ type: "jsonb", default: {} })
  metadata?: Record<string, unknown> | null;

  @Column({ type: "character varying", nullable: true })
  thumbnail?: string;

  @BeforeInsert()
  protected async beforeInsert(): Promise<void> {
    this.id = generateEntityId(this.id, "ofs");
  }
}
