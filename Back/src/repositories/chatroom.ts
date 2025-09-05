import { BaseRepository } from "data-source";
import { Chatroom } from "models/chatroom";
import { inject, injectable } from "tsyringe";
import { EntityManager } from "typeorm";

@injectable()
export class ChatroomRepository extends BaseRepository<Chatroom> {
  constructor(@inject("dataSource") public readonly manager: EntityManager) {
    super(manager, Chatroom);
  }
}
