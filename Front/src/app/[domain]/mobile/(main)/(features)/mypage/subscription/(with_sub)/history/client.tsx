"use client";
import { useEffect, useState } from "react";
import VerticalFlex from "@/components/flex/VerticalFlex";
import NoContent from "@/components/noContent/noContent";
import P from "@/components/P/P";
import styles from "./page.module.css";
import FlexChild from "@/components/flex/FlexChild";
import { requester } from "@/shared/Requester";

type Row = {
  id: string;
  name?: string;
  price?: number;
  payment_data?: { amount?: number } | null;
  created_at?: string;
  starts_at?: string;
};

const fmt = (v?: string) =>
  v ? new Date(v).toISOString().slice(0, 10).replaceAll("-", ".") : "-";

export function HistoryList() {
  const [rows, setRows] = useState<Row[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 20;

  const load = async (p = 0) => {
    const r = await requester.getMySubscribes({
      pageSize: PAGE_SIZE,
      pageNumber: p,
      order: { created_at: "DESC", id: "ASC" },
    });
    const list: Row[] =
      Array.isArray(r?.content) ? r.content : r?.content?.content ?? [];
    setRows(p === 0 ? list : (prev) => [...prev, ...list]);
    const last =
      typeof r?.last === "boolean" ? r.last : (list?.length || 0) < PAGE_SIZE;
    setHasMore(!last);
  };

  useEffect(() => {
    load(0);
  }, []);

  if (rows.length === 0)
    return (
      <VerticalFlex gap={35}>
        <VerticalFlex className={styles.payment_list}>
          <NoContent type="결제" />
        </VerticalFlex>
      </VerticalFlex>
    );

  return (
    <VerticalFlex gap={35}>
      <VerticalFlex className={styles.payment_list}>
        {rows.map((it) => {
          const amount = Number(it?.payment_data?.amount ?? it?.price ?? 0) || 0;
          const date = fmt(it?.created_at ?? it?.starts_at);
          const title = it?.name || "구독 결제";
          return (
            <VerticalFlex className={styles.item} key={it.id}>
              <FlexChild>
                <P className={styles.date}>{date}</P>
              </FlexChild>
              <FlexChild>
                <P className={styles.title}>{title}</P>
              </FlexChild>
              <FlexChild justifyContent="end" className={styles.price_box}>
                <P className={styles.price}>{amount.toLocaleString()}원</P>
              </FlexChild>
            </VerticalFlex>
          );
        })}
      </VerticalFlex>

      {hasMore && (
        <FlexChild justifyContent="center">
          <button
            className={styles.more_btn}
            onClick={async () => {
              const next = page + 1;
              await load(next);
              setPage(next);
            }}
          >
            더 보기
          </button>
        </FlexChild>
      )}
    </VerticalFlex>
  );
}
