"use client";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import NoContent from "@/components/noContent/noContent";
import P from "@/components/P/P";
import useInfiniteData from "@/shared/hooks/data/useInfiniteData";
import useNavigate from "@/shared/hooks/useNavigate";
import { requester } from "@/shared/Requester";
import styles from "./page.module.css";
import ProductLoadBtn from "@/components/buttons/ProductLoadBtn";
import Button from "@/components/buttons/Button";

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

  // A) 우리 메타 기록 우선: { cancel_meta: { quote: { refund:number } } } ----
  const metaRefund = cd?.cancel_meta?.quote?.refund;
  if (typeof metaRefund === "number") return metaRefund;

  // B) 루트에 직접 기록: { refund:number }
  if (typeof cd.refund === "number") return cd.refund;

  // C) NESTPAY 형태가 중첩: { refund: { amount:number, ... } }
  if (cd.refund && typeof cd.refund?.amount === "number")
    return cd.refund.amount;

  // D) TOSS 형태가 중첩: { refund: { cancels:[{ cancelAmount:number }] } }
  const nestedCancels = cd.refund?.cancels;
  if (Array.isArray(nestedCancels)) {
    const s = nestedCancels.reduce(
      (acc: number, c: any) => acc + (Number(c?.cancelAmount) || 0),
      0
    );
    if (s > 0) return s;
  }
  // E) 과거 루트에 TOSS 배열 저장: { cancels:[...] }
  if (Array.isArray(cd.cancels)) {
    const s = cd.cancels.reduce(
      (acc: number, c: any) => acc + (Number(c?.cancelAmount) || 0),
      0
    );
    if (s > 0) return s;
  }

  // F) 기타 호환
  if (typeof cd.cancelAmount === "number") return cd.cancelAmount;
  if (typeof cd.amount === "number") return cd.amount;

  return 0;
};

export function HistoryList() {
  const navigate = useNavigate();
  const PAGE_SIZE = 5;

  const { subsHistory, isLoading, origin, Load, page, maxPage } =
    useInfiniteData(
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
        if (tp > 0) return tp;
        return 1;
      },
      {
        onReprocessing: (d: any) => {
          if (Array.isArray(d?.content)) return d.content;
          if (Array.isArray(d)) return d;
          return d?.content?.content ?? [];
        },
        flat: true,
        revalidateOnMount: true,
        cache: { revalidateAll: false },
      }
    ) as any;

  const rows: Row[] = subsHistory ?? [];
  const lastResp = Array.isArray(origin) ? origin[origin.length - 1] : origin;
  const hasMore = Boolean(lastResp && lastResp.last === false);

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
      <VerticalFlex className={styles.payment_list}>
        {rows.map((it) => {
          const amount =
            Number(it?.payment_data?.amount ?? it?.price ?? 0) || 0;
          const date = fmt(it?.created_at ?? it?.starts_at);
          const title = it?.name || "구독 결제";
          const refund = pickRefundAmount(it?.cancel_data);
          const isCanceled = Boolean(it?.canceled_at);

          return (
            <VerticalFlex className={styles.item} key={it.id}>
              <HorizontalFlex>
                <FlexChild>
                  <P className={styles.date}>{date}</P>
                </FlexChild>
                <FlexChild justifyContent="flex-end" hidden={isCanceled}>
                  <P
                    className={styles.revoke}
                    onClick={() =>
                      navigate(`/mypage/subscription/${it.id}/cancel`)
                    }
                  >
                    해지하기
                  </P>
                </FlexChild>
              </HorizontalFlex>
              <FlexChild>
                <P className={styles.title}>
                  {title}
                  {isCanceled ? " (취소)" : ""}
                </P>
              </FlexChild>
              <FlexChild className={styles.price_box}>
                <VerticalFlex alignItems="end">
                  <P className={styles.price}>
                    {amount.toLocaleString("ko-KR")}원
                  </P>
                  {isCanceled && refund > 0 && (
                    <P className={styles.price_sub}>
                      환불금액 {refund.toLocaleString("ko-KR")}원
                    </P>
                  )}
                </VerticalFlex>
              </FlexChild>
            </VerticalFlex>
          );
        })}
      </VerticalFlex>

      {hasMore && (
        <FlexChild justifyContent="center">
          <Button className={styles.more_btn} onClick={Load}>
            더 보기
          </Button>
        </FlexChild>
      )}
    </VerticalFlex>
  );
}
