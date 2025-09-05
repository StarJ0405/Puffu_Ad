import { BaseEntity } from "data-source";
import { BeforeInsert, Column, Entity, Index, OneToMany } from "typeorm";
import { generateEntityId } from "utils/functions";
import { Chat } from "./chat";
import { ChatroomUser } from "./chatroom-user";

@Entity({ name: "chatroom" })
@Index(["created_at", "title"])
// CREATE INDEX IF NOT EXISTS idx_chatroom_title ON public.chatroom USING GIN (fn_text_to_char_array(title));
export class Chatroom extends BaseEntity {
  @Column({ type: "character varying", nullable: false })
  title?: string;

  @Column({ type: "jsonb", default: {} })
  metadata?: Record<string, unknown> | null;

  @OneToMany(() => Chat, (chat) => chat.room)
  chats?: Chat[];

  @OneToMany(() => ChatroomUser, (cu) => cu.room)
  users?: ChatroomUser[];

  @BeforeInsert()
  protected async BeforeInsert(): Promise<void> {
    this.id = generateEntityId(this.id, "chr");
  }
}
