import { BaseRepository } from "data-source";
import { Notice } from "models/notice";
import { inject, injectable } from "tsyringe";
import { EntityManager } from "typeorm";

@injectable()
export class NoticeRepository extends BaseRepository<Notice> {
  constructor(@inject("dataSource") public readonly manager: EntityManager) {
    super(manager, Notice);
  }
}
