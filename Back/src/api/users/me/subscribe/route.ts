import { SubscribeService } from "services/subscribe";
import { container } from "tsyringe";
import { IsNull } from "typeorm";

const toDate = (v: string | number | Date | null | undefined): Date | null =>
  v == null ? null : new Date(v);

// POST /users/me/subscribe  : 신규 가입 + 사전 재가입
export const POST: ApiHandler = async (req, res) => {
  const user_id = req.user?.id;
  if (!user_id) return res.status(401).json({ error: "unauthorized" });

  const { plan_id, store_id, name, starts_at, ends_at, payment } = req.body || {};
  if (!ends_at) return res.status(400).json({ error: "ends_at required" });

  const service: SubscribeService = container.resolve(SubscribeService);

  // 플랜 결정
  let plan = null as any;
  if (plan_id) {
    const list = await service.getList({ where: { id: plan_id, user_id: IsNull() }, take: 1 });
    plan = list[0] || null;
  } else {
    if (!store_id) return res.status(400).json({ error: "store_id required" });
    plan = await service.getDefaultPlan(store_id, name);
  }
  if (!plan) return res.status(404).json({ error: "plan not found" });

  // 활성 구독 검사 + 사전 재구매 정책
  const now = new Date();
  const active = await service.getLatestActive(user_id, plan.store_id, now);

  let startDate: Date;
  if (!active) {
    const s = toDate(starts_at);
    startDate = s && s > now ? s : now;
  } else if (service.canPrepurchase(active, now)) {
    const endAt = toDate(active.ends_at);
    if (!endAt) return res.status(409).json({ error: "rejoin_not_allowed" });
    startDate = endAt;
  } else {
    const endAt = toDate(active.ends_at);
    if (!endAt) return res.status(409).json({ error: "rejoin_not_allowed" });
    const remaining = Math.ceil((endAt.getTime() - now.getTime()) / 86400000);
    return res.status(409).json({
      error: "rejoin_not_allowed",
      remaining_days: remaining,
      allow_after: endAt.toISOString(),
    });
  }

  const endDate = toDate(ends_at);
  if (!endDate || !(endDate > startDate)) {
    return res.status(400).json({ error: "ends_at must be after starts_at" });
  }

  const created = await service.createFromPlan(user_id, plan, startDate, endDate, payment);
  return res.json(created);
};

// GET /users/me/subscribe  : 리스트 또는 최신 1건
export const GET: ApiHandler = async (req, res) => {
  const user_id = req.user?.id;
  if (!user_id) return res.status(401).json({ error: "unauthorized" });

  const {
    latest,          // true 면 최신 1건
    store_id,        // latest 검색 시 필터 권장
    pageSize,
    pageNumber = 0,
    relations,
    order,
    select,
    withDeleted,
    ...where
  } = req.parsedQuery || {};

  const service: SubscribeService = container.resolve(SubscribeService);

  // 최신 1건
  if (latest) {
    if (!store_id) {
      // store 미지정이면 사용자 전체에서 최신 1건
      const list = await service.getList({
        where: { ...where, user_id },
        order: { ends_at: "DESC", created_at: "DESC" },
        take: 1,
      });
      return res.json({ content: list });
    }
    const active = await service.getLatestActive(String(user_id), String(store_id));
    return res.json({ content: active ? [active] : [] });
  }

  // 페이지네이션
  if (pageSize) {
    const page = await service.getPageable(
      { pageSize: Number(pageSize), pageNumber: Number(pageNumber) },
      { select, order, relations, where: { ...where, user_id }, withDeleted }
    );
    return res.json(page);
  }

  // 기본 리스트
  const content = await service.getList({
    select,
    order: order ?? { created_at: "DESC", id: "ASC" },
    relations,
    where: { ...where, user_id },
    withDeleted,
  });
  return res.json({ content });
};
