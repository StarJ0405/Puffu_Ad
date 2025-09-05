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

export enum ChatType {
  MESSAGE = "message",
  IMAGE = "image",
  LINK = "link",
  FILE = "file",
}

@Entity({ name: "chat" })
@Index(["created_at"])
// CREATE INDEX IF NOT EXISTS idx_chatroom_name ON public.chatroom USING GIN (fn_text_to_char_array(name));
// CREATE INDEX IF NOT EXISTS idx_chatroom_type ON public.chatroom USING GIN (fn_text_to_char_array(type));
export class Chat extends BaseEntity {
  @Column({ type: "character varying", nullable: false })
  message?: string;

  @Column({ type: "character varying", nullable: false })
  room_id?: string;

  @Column({ type: "character varying", nullable: false })
  type?: ChatType;

  @ManyToOne(() => Chatroom, (room) => room.chats)
  @JoinColumn({ name: "room_id", referencedColumnName: "id" })
  room?: Chatroom;

  @Column({ type: "character varying", nullable: false })
  user_id?: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  user?: User;

  @Column({ type: "jsonb", default: {} })
  metadata?: Record<string, unknown> | null;

  @BeforeInsert()
  protected async BeforeInsert(): Promise<void> {
    this.id = generateEntityId(this.id, "cht");
  }
}
