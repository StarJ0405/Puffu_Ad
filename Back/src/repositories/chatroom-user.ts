import { BaseRepository } from "data-source";
import { Chat } from "models/chat";
import { inject, injectable } from "tsyringe";
import { EntityManager } from "typeorm";

@injectable()
export class ChatRepository extends BaseRepository<Chat> {
  constructor(@inject("dataSource") public readonly manager: EntityManager) {
    super(manager, Chat);
  }
}
