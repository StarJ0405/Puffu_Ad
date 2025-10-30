"use client";
import { useEffect, useState } from "react";
import VerticalFlex from "@/components/flex/VerticalFlex";
import NoContent from "@/components/noContent/noContent";
import P from "@/components/P/P";
import styles from "./page.module.css";
import FlexChild from "@/components/flex/FlexChild";
import { requester } from "@/shared/Requester";
import usePageData from "@/shared/hooks/data/usePageData";
import ListPagination from "@/components/listPagination/ListPagination";

type Row = {
  id: string;
  name?: string;
  price?: number;
  payment_data?: { amount?: number } | null;
  created_at?: string;
  starts_at?: string;
  canceled_at?: string | null;
  cancel_data?: any;
};

const fmt = (v?: string) =>
  v ? new Date(v).toISOString().slice(0, 10).replaceAll("-", ".") : "-";

const pickRefundAmount = (cd: any): number => {
  if (!cd) return 0;
  if (typeof cd.refund === "number") return cd.refund;
  if (cd.refund && typeof cd.refund.amount === "number") return cd.refund.amount;
  if (Array.isArray(cd.cancels)) {
    const s = cd.cancels.reduce(
      (acc: number, c: any) => acc + (Number(c?.cancelAmount) || 0),
      0
    );
    if (s > 0) return s;
  }
  if (typeof cd.cancelAmount === "number") return cd.cancelAmount;
  if (typeof cd.amount === "number") return cd.amount;
  return 0;
};

export function HistoryList() {
  const PAGE_SIZE = 5;

  const {
    subsHistory,
    origin,
    isLoading,
    page,
    setPage,
    maxPage,
    hasNext,
  } = usePageData(
    "subsHistory",
    (index) => ({
      activeOnly: false,
      pageSize: PAGE_SIZE,
      pageNumber: index,
      order: { created_at: "DESC", id: "ASC" },
    }),
    (params) => requester.getMySubscribes(params),
    (data) => {
      const tp = Number(data?.totalPages ?? 0);
      return tp > 0 ? tp : 1;
    },
    {
      onReprocessing: (d: any) => {
        if (Array.isArray(d?.content)) return d.content;
        if (Array.isArray(d)) return d;
        return d?.content?.content ?? [];
      },
      revalidateOnMount: true,
      cache: { revalidateIfStale: true },
      // fallbackData: 초기 데이터가 있으면 지정
    }
  ) as any;

  const rows: Row[] = subsHistory ?? [];

  if (!isLoading && rows.length === 0) {
    return (
      <VerticalFlex gap={35}>
        <VerticalFlex className={styles.payment_list}>
          <NoContent type="결제" />
        </VerticalFlex>
      </VerticalFlex>
    );
  }

  return (
    <VerticalFlex gap={35}>
      <table className={styles.list_table}>
        <colgroup>
          <col style={{ width: "20%" }} />
          <col style={{ width: "60%" }} />
          <col style={{ width: "20%" }} />
        </colgroup>

        <thead>
          <tr className={styles.table_header}>
            <th>결제일</th>
            <th>제목</th>
            <th>결제 금액</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((it) => {
            const amount = Number(it?.payment_data?.amount ?? it?.price ?? 0) || 0;
            const date = fmt(it?.created_at ?? it?.starts_at);
            const title = it?.name || "구독 결제";
            const refund = pickRefundAmount(it?.cancel_data);
            const isCanceled = Boolean(it?.canceled_at);

            return (
              <tr className={styles.item} key={it.id}>
                <td>
                  <FlexChild justifyContent="center">
                    <P className={styles.date}>{date}</P>
                  </FlexChild>
                </td>

                <td>
                  <FlexChild justifyContent="center">
                    <P className={styles.title}>
                      {title}
                      {isCanceled ? " (취소)" : ""}
                    </P>
                  </FlexChild>
                </td>

                <td>
                  <VerticalFlex gap={10}>
                    <P className={styles.price}>{amount.toLocaleString()}원</P>
                    {isCanceled && (
                      <P className={styles.price_sub}>
                        환불금액 {refund.toLocaleString()}원
                      </P>
                    )}
                  </VerticalFlex>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <FlexChild justifyContent="center" gap={10}>
        <ListPagination
          page={page}
          maxPage={maxPage}
          onChange={(next) => setPage(next)}
        />
      </FlexChild>
    </VerticalFlex>
  );
}
