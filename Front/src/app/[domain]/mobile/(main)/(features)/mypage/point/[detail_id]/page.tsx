import VerticalFlex from "@/components/flex/VerticalFlex";
import mypage from "../../mypage.module.css";
import clsx from "clsx";
import styles from "./page.module.css";
import { PointDetail } from "./client";
import { requester } from "@/shared/Requester";
import { notFound } from "next/navigation";
import { Params } from "next/dist/server/request/params";

async function getPointById(detail_id: string) {
  const direct = await requester.getPoints({
    pageSize: 1,
    pageNumber: 0,
    id: detail_id,
    select: ["id", "data", "created_at", "name"],
    order: { created_at: "DESC", id: "DESC" },
  });
  const d = direct?.data ?? direct;
  const hit = d?.content?.[0];
  if (hit?.id === detail_id) return hit;

  const pageSize = 100;
  let pageNumber = 0;
  while (true) {
    const r = await requester.getPoints({
      pageSize,
      pageNumber,
      select: ["id", "data", "created_at", "name"],
      order: { created_at: "DESC", id: "DESC" },
    });
    const data = r?.data ?? r;
    const list: any[] = data?.content ?? [];
    const found = list.find((x) => x?.id === detail_id);
    if (found) return found;
    const totalPages = Number(data?.totalPages ?? 0);
    pageNumber += 1;
    if (!Number.isFinite(totalPages) || pageNumber >= totalPages) return null;
  }
}

function around(iso: string, hours = 48) {
  const base = new Date(iso).getTime();
  const ms = hours * 60 * 60 * 1000;
  return {
    start_date: new Date(base - ms).toISOString(),
    end_date: new Date(base + ms).toISOString(),
  };
}

async function getOrderByDisplay(display: string, logCreatedAt?: string) {
  const timeFilter = logCreatedAt ? around(logCreatedAt, 48) : {};

  const r1 = await requester.getOrders({
    pageSize: 1,
    pageNumber: 0,
    display: String(display),
    ...timeFilter,
    relations: ["items", "items.variant.product", "items.brand", "store"],
    order: { created_at: "DESC", id: "DESC" },
  });
  const d1 = r1?.data ?? r1;
  let order = d1?.content?.[0] ?? null;
  if (order) return order;

  const r2 = await requester.getOrders({
    pageSize: 5,
    pageNumber: 0,
    q: String(display),
    ...timeFilter,
    relations: ["items", "items.variant.product", "items.brand", "store"],
    order: { created_at: "DESC", id: "DESC" },
  });
  const d2 = r2?.data ?? r2;
  order = (d2?.content ?? []).find((o: any) => o?.display === display) ?? null;
  return order;
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { detail_id } = await params;

  const initDetail = await getPointById(detail_id as string);
  if (!initDetail) return notFound();

  const display: string | undefined = initDetail?.data?.display;
  const initOrder = display
    ? await getOrderByDisplay(display, initDetail?.created_at)
    : null;

  return (
    <VerticalFlex
      className={clsx(mypage.box_frame, styles.delivery_box, 'mob_page_container')}
      gap={35}
    >
      <PointDetail initDetail={initDetail} initOrder={initOrder} />
    </VerticalFlex>
  );
}
