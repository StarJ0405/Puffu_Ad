import { inject, injectable } from "tsyringe";
import { BaseService } from "data-source";
import { InputField } from "models/input_field";
import { InputFieldRepository } from "repositories/input_field";
import { Log } from "models/log";
import { Page } from "models/page";
import { Contract } from "models/contract";
import { IsNull } from "typeorm";

@injectable()
export class InputFieldService extends BaseService<
  InputField,
  InputFieldRepository
> {
  constructor(@inject(InputFieldRepository) repo: InputFieldRepository) {
    super(repo);
  }

  // 템플릿 내 필드 생성
  async createField(page_id: string, data: any) {
    return await this.repository.manager.transaction(async (manager) => {
      const page = await manager.findOne(Page, {
        where: { id: page_id },
        relations: ["contract"],
      });
      if (!page || !page.contract || page.contract.origin_id !== null)
        throw new Error("Only template pages can add fields");

      const field = manager.create(InputField, {
        page_id,
        type: data.type,
        metadata: data.metadata ?? {},
        value: {},
      });
      await manager.save(field);

      const log = manager.create(Log, {
        name: "input_field_create",
        type: "template",
        data: { page_id, field_id: field.id, action: "create" },
      });
      await manager.save(log);

      return field;
    });
  }

  // 필드 수정 (type, metadata)
  async updateField(id: string, data: Partial<InputField>) {
    return await this.repository.manager.transaction(async (manager) => {
      const field = await manager.findOne(InputField, {
        where: { id },
        relations: ["page", "page.contract"],
      });
      if (!field || !field.page?.contract || field.page.contract.origin_id !== null)
        throw new Error("Only template fields can be modified");

      await manager.update(InputField, { id }, data as any);

      const log = manager.create(Log, {
        name: "input_field_update",
        type: "template",
        data: { field_id: id, action: "update" },
        metadata: { diff: data },
      });
      await manager.save(log);
    });
  }

  // 필드 삭제
  async deleteField(id: string) {
    return await this.repository.manager.transaction(async (manager) => {
      const field = await manager.findOne(InputField, {
        where: { id },
        relations: ["page", "page.contract"],
      });
      if (!field || !field.page?.contract || field.page.contract.origin_id !== null)
        throw new Error("Only template fields can be deleted");

      await manager.delete(InputField, { id });

      const log = manager.create(Log, {
        name: "input_field_delete",
        type: "template",
        data: { field_id: id, action: "delete" },
      });
      await manager.save(log);
    });
  }

  // 특정 페이지의 모든 필드 조회
  async getFieldsByPage(page_id: string) {
    return await this.repository.findAll({
      where: { page_id },
      order: { created_at: "ASC" },
    });
  }
}
