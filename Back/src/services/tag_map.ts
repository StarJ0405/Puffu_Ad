import { inject, injectable } from "tsyringe";
import { BaseService } from "data-source";
import { TagMapRepository } from "repositories/tag_map";
import { TagMap } from "models/tag_map";

@injectable()
export class TagMapService extends BaseService<TagMap, TagMapRepository> {
  constructor(@inject(TagMapRepository) repo: TagMapRepository) {
    super(repo);
  }

  buildWhere(q?: string, contract_id?: string, store_id?: string, tag?: string) {
    let where: any = {};
    if (q) where = this.Search(where, ["tag"], q);
    if (contract_id) where.contract_id = contract_id;
    if (store_id) where.store_id = store_id;
    if (tag) where.tag = tag;
    return where;
  }

  // 태그 등록 (중복 방지)
  async assignTag(contract_id: string, tag: string, store_id: string) {
    const existing = await this.repository.findOne({ where: { contract_id, tag } });
    if (existing) return existing;
    return await this.create({ contract_id, tag, store_id } as any);
  }

  // 태그 해제
  async removeTag(contract_id: string, tag: string) {
    const existing = await this.repository.findOne({ where: { contract_id, tag } });
    if (existing) {
      await this.delete({ id: existing.id });
    }
  }

  // 특정 계약의 태그 목록 조회
  async getTags(contract_id: string) {
    const list = await this.repository.findAll({ where: { contract_id } });
    return list.map((t) => t.tag);
  }
}
