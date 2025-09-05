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
import { Chatroom } from "./chatroom";
import { User } from "./user";

@Entity({ name: "chatroom_user" })
@Index(["created_at", "room_id", "user_id"])
export class ChatroomUser extends BaseEntity {
  @Column({ type: "character varying", nullable: false })
  room_id?: string;

  @ManyToOne(() => Chatroom)
  @JoinColumn({ name: "room_id", referencedColumnName: "id" })
  room?: Chatroom;

  @Column({ type: "character varying", nullable: false })
  user_id?: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  user?: User;

  @Column({
    type: "timestamp with time zone",
    default: () => "CURRENT_TIMESTAMP",
    nullable: true,
  })
  last_read?: Date;

  @Column({ type: "jsonb", default: {} })
  metadata?: Record<string, unknown> | null;

  @BeforeInsert()
  protected async BeforeInsert(): Promise<void> {
    this.id = generateEntityId(this.id, "chu");
  }
}
