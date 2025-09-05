import { BaseRepository } from "data-source";
import { ChatroomUser } from "models/chatroom-user";
import { inject, injectable } from "tsyringe";
import { EntityManager } from "typeorm";

@injectable()
export class ChatroomUserRepository extends BaseRepository<ChatroomUser> {
  constructor(@inject("dataSource") public readonly manager: EntityManager) {
    super(manager, ChatroomUser);
  }
}
