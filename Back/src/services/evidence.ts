import { inject, injectable } from "tsyringe";
import { BaseService } from "data-source";
import { EvidenceRepository } from "repositories/evidence";
import { Evidence } from "models/evidence";

@injectable()
export class EvidenceService extends BaseService<Evidence, EvidenceRepository> {
  constructor(@inject(EvidenceRepository) repo: EvidenceRepository) {
    super(repo);
  }

  buildWhere(q?: string, contract_id?: string, store_id?: string) {
    let where: any = {};
    if (q)
      where = this.Search(where, ["file_name", "file_bucket", "file_key"], q);
    if (contract_id) where.contract_id = contract_id;
    if (store_id) where.store_id = store_id;
    return where;
  }

  // 증빙 파일 등록 또는 갱신
  async attachFile(
    contract_id: string,
    file: { bucket: string; key: string; name?: string },
    metadata?: Record<string, unknown>
  ) {
    const existing = await this.repository.findOne({ where: { contract_id } });

    if (existing) {
      await this.update(
        { id: existing.id },
        {
          file_bucket: file.bucket,
          file_key: file.key,
          file_name: file.name,
          verified: false,
          metadata: {
            ...(existing.metadata || {}),
            ...(metadata || {}),
          } as any,
        }
      );
      return await this.getById(existing.id);
    }

    return await this.create({
      contract_id,
      file_bucket: file.bucket,
      file_key: file.key,
      file_name: file.name,
      verified: false,
      metadata,
    } as any);
  }

  // 검증 상태 업데이트
  async verify(id: string, result: boolean, info?: Record<string, unknown>) {
    const evidence = await this.getById(id);
    if (!evidence) throw new Error("evidence_not_found");

    evidence.verified = result;
    evidence.metadata = { ...(evidence.metadata || {}), verified_info: info };

    return await this.repository.save(evidence);
  }
}
