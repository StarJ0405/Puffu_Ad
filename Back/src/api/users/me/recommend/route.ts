import { Recommend } from "models/recommend";
import { RecommendService } from "services/recommend";
import { container } from "tsyringe";

export const POST: ApiHandler = async (req, res) => {
  const user = req.user;
  const { review_id, metadata, return_data = false } = req.body;

  const service: RecommendService = container.resolve(RecommendService);
  try {
    const _data = {
      user_id: user.id,
      review_id,
      metadata,
    };

    // 유니크 제약( user_id, review_id ) 충돌 시 멱등 처리
    const result: Recommend = await service.create(_data).catch((err: any) => {
      // PG unique_violation
      if (err?.code === "23505") {
        return null as any; // 이미 추천한 상태로 간주
      }
      throw err;
    });

    if (return_data) {
      // 이미 눌렀던 경우 result가 null일 수 있으므로 재조회로 통일감 있게 반환
      const list = await service.getList({
        where: { user_id: user.id, review_id },
        relations: undefined,
        select: undefined,
        order: undefined,
      });
      return res.json({ content: list?.[0] ?? null });
    }

    return res.json({ message: "success" });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message, status: 500 });
  }
};

export const GET: ApiHandler = async (req, res) => {
  const user = req.user;
  let {
    pageSize,
    pageNumber = 0,
    relations,
    order,
    select,
    ...where
  } = req.parsedQuery;

  const service: RecommendService = container.resolve(RecommendService);
  where = { ...where, user_id: user.id };

  if (pageSize) {
    const page = await service.getPageable(
      {
        pageSize: Number(pageSize),
        pageNumber: Number(pageNumber),
      },
      { select, order, relations, where }
    );
    return res.json(page);
  } else {
    const content = await service.getList({ select, order, relations, where });
    return res.json({ content });
  }
};
