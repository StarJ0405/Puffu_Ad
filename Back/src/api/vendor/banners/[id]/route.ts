import { Banner } from "models/banner";
import { BannerService } from "services/banner";
import { container } from "tsyringe";

export const POST: ApiHandler = async (req, res) => {
  const { id } = req.params;
  const {
    name, store_id, thumbnail, to, starts_at, ends_at,
    adult, visible, metadata, return_data = false,
    importance,
  } = req.body;

  const service: BannerService = container.resolve(BannerService);
  try {
    // 중요도 이동 처리
    if (store_id && typeof importance === "number") {
      await service.updateImportance(store_id, id, importance);
      return res.json({ message: "success" });
    }

    // 일반 업데이트
    const _data = { name, store_id, thumbnail, to, starts_at, ends_at, adult, visible, metadata };
    const result: UpdateResult<Banner> = await service.update({ id }, _data, true);
    return res.json(return_data ? { content: result } : { message: "success" });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message, status: 500 });
  }
};

export const GET: ApiHandler = async (req, res) => {
  const { id } = req.params;
  const { select, relations, withDeleted } = req.parsedQuery;
  const service: BannerService = container.resolve(BannerService);
  const content = await service.getById(id, { select, relations, withDeleted });
  return res.json({ content });
};

export const DELETE: ApiHandler = async (req, res) => {
  const { id } = req.params;
  const { soft } = req.parsedQuery;
  const service: BannerService = container.resolve(BannerService);
  // 삭제 시 즉시 압축 적용: store_id 조회 후 pull
  const b = await service.getById(id, { select: ["id", "store_id"] });
  if (!b) return res.status(404).json({ error: "not found" });

  await service.deleteAndPull(b.store_id as string, id);
  return res.json({ message: "success" });
};
