"use client";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import NoContent from "@/components/noContent/noContent";
import P from "@/components/P/P";
import styles from "./page.module.css";
import ListPagination from "@/components/listPagination/ListPagination";
import FlexChild from "@/components/flex/FlexChild";
import { requester } from "@/shared/Requester";
import { useEffect, useMemo, useState } from "react";

type SubRow = {
  id: string;
  name?: string;
  price?: number;
  payment_data?: { amount?: number } | null;
  created_at?: string;
  starts_at?: string;
  ends_at?: string;
};

const fmtDate = (v?: string) =>
  v ? new Date(v).toISOString().slice(0, 10).replaceAll("-", ".") : "-";

export function HistoryList() {
  const [rows, setRows] = useState<SubRow[]>([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 20;

  const load = async (page = 0) => {
    const r = await requester.getMySubscribes({
      pageSize: PAGE_SIZE,
      pageNumber: page,
      order: { created_at: "DESC", id: "ASC" },
    });
    const list: SubRow[] = r?.content ?? r?.content?.content ?? [];
    if (page === 0) setRows(list);
    else setRows((prev) => [...prev, ...list]);

    const last: boolean =
      typeof r?.last === "boolean" ? r.last : (list?.length || 0) < PAGE_SIZE;
    setHasMore(!last);
  };

  useEffect(() => {
    load(0);
  }, []);

  const onLoadMore = async () => {
    if (!hasMore) return;
    const next = pageNumber + 1;
    await load(next);
    setPageNumber(next);
  };

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
        {rows.map((it:any) => {
          const amount =
            Number(it?.payment_data?.amount ?? it?.price ?? 0) || 0;
          const date = fmtDate(it?.created_at ?? it?.starts_at);
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
          <button className={styles.more_btn} onClick={onLoadMore}>
            더 보기
          </button>
        </FlexChild>
      )}
    </VerticalFlex>
  );
}
