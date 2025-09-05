import { LogRepository } from "repositories/log";
import { LinkService } from "services/link";
import { PointService } from "services/point";
import { container } from "tsyringe";

export const POST: ApiHandler = async (req, res) => {
  const user = req.user;
  const { code } = req.body;
  const linkService = container.resolve(LinkService);
  const pointService = container.resolve(PointService);
  const link = await linkService.get({
    where: {
      code,
    },
    withDeleted: true,
  });
  if (!link) return res.status(404).json({ error: "잘못된 접근입니다." });

  if (
    (link.chance || 0) <= 0 ||
    new Date(link.start_date || 0).getTime() > new Date().getTime() ||
    (link.end_date && new Date(link.end_date).getTime() < new Date().getTime())
  )
    return res
      .status(404)
      .json({ error: "이미 사용되었거나 만료된 링크입니다." });
  const point = Number(link?.data?.point || 1500);
  await linkService.update(
    {
      id: link.id,
    },
    {
      chance: 0,
      metadata: () => `metadata || '{"usedBy":"${user.id}"}'::jsonb`,
    }
  );

  await pointService.create({
    user_id: user.id,
    point,
  });

  const repo = container.resolve(LogRepository);
  await repo.create({
    type: "point",
    name: String(link?.data?.name || `액상 라벨 이벤트`),
    data: {
      point: point,
      user_id: user.id,
    },
  });
  return res.json({ point });
};
