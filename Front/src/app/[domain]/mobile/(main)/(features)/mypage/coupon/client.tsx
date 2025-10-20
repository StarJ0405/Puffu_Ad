"use client";
import CouponItemMobile from "@/components/coupon/couponItemMobile";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import ListPagination from "@/components/listPagination/ListPagination";
import NoContent from "@/components/noContent/noContent";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import { useAuth } from "@/providers/AuthPorivder/AuthPorivderClient";
import usePageData from "@/shared/hooks/data/usePageData";
import { requester } from "@/shared/Requester";
import { useMemo, useState, useRef, useEffect } from "react";
import mypage from "../mypage.module.css";
import styles from "./page.module.css";
import clsx from "clsx";

type FilterKey = "all" | "item" | "order" | "shipping" | "expired";
/* type ExpiredSub = "expired" | "expired_date" | "expired_used";
// status 종류:
// - "expired"      → 기간만료 + 사용만료 전체
// - "expired_date" → 기간만료만 (미사용)
// - "expired_used" → 사용된 쿠폰만 (기간무관)
 */
export function CouponList({ initCoupons }: { initCoupons: Pageable }) {
  const { userData } = useAuth();
  const [filter, setFilter] = useState<FilterKey>("all");
  // const [expiredSub, setExpiredSub] = useState<ExpiredSub>("expired");
  const PAGE_SIZE = 5;
  const where = useMemo(() => {
    switch (filter) {
      case "item":
        return { type: "item" };
      case "order":
        return { type: "order" };
      case "shipping":
        return { type: "shipping" };
      case "expired":
        return { status: "expired_date" };
      default:
        return {};
    }
  }, [filter]);

  const { coupons, page, maxPage, setPage, origin } = usePageData(
    "coupons",
    (pageNumber) => ({ pageNumber, pageSize: PAGE_SIZE, ...where }),
    (cond) => requester.getCoupons(cond),
    (d: Pageable) => d?.totalPages || 0,
    { fallbackData: initCoupons, onReprocessing: (d) => d?.content || [] }
  );

  const tabs: { key: FilterKey; label: string }[] = [
    { key: "all", label: "전체" },
    { key: "item", label: "상품 할인" },
    { key: "order", label: "주문 할인" },
    { key: "shipping", label: "배송 할인" },
    { key: "expired", label: "만료" },
  ];

  const allTotalRef = useRef<number>(
      initCoupons?.NumberOfTotalElements ?? initCoupons?.content?.length ?? 0
    );
  
    useEffect(() => {
      if (filter === "all") {
        const n = origin?.NumberOfTotalElements;
        if (typeof n === "number") allTotalRef.current = n;
      }
    }, [filter, origin]);
  
  const allTotal = allTotalRef.current;
  
  /* const expiredTabs: { key: ExpiredSub; label: string }[] = [
    { key: "expired", label: "전체" },
    { key: "expired_date", label: "기간만료" },
    { key: "expired_used", label: "사용만료" },
  ]; */

  /*   const onTabClick = (k: FilterKey) => {
    if (k !== filter) {
      setPage(0);
      if (k !== "expired") setExpiredSub("expired");
    }
    setFilter(k);
  }; */

  const onTabClick = (k: FilterKey) => {
    if (k !== filter) setPage(0);
    setFilter(k);
  };

  return (
    <>
      <HorizontalFlex className={mypage.box_header} justifyContent="flex-start">
        <P>사용 가능 쿠폰</P>
        <P className={styles.total_count}>
          <Span>{userData?.coupon}</Span>
        </P>
      </HorizontalFlex>
      <HorizontalFlex gap={15} justifyContent="flex-start">
        {tabs.map((t) => (
          <P
            key={t.key}
            cursor="pointer"
            className={clsx(styles.tab, {
              [styles.activeTab]: filter === t.key,
            })}
            onClick={() => onTabClick(t.key)}
          >
            {t.key === "all" ? `${t.label} (${allTotal})` : t.label}
          </P>
        ))}

        {/* {filter === "expired" && (
          <HorizontalFlex
            gap={12}
            justifyContent="flex-start"
            className={styles.subTabs}
          >
            <P className={styles.subTab}>|</P>
            {tabs.map((st) => (
              <P
                key={st.key}
                cursor="pointer"
                className={clsx(styles.subTab, {
                  [styles.activeSubTab]: filter === st.key,
                })}
                onClick={() => onTabClick(st.key)}
              >
                {st.key === "all" ? `${st.label} (${allTotal})` : st.label}
              </P>
            ))}
          </HorizontalFlex>
        )} */}
      </HorizontalFlex>
      {coupons?.length > 0 ? (
        <VerticalFlex gap={15}>
          {coupons?.map((coupon: CouponData) => (
            <CouponItemMobile key={coupon.id} coupon={coupon} />
          ))}
        </VerticalFlex>
      ) : (
        <NoContent type="쿠폰" />
      )}
      <FlexChild>
        <ListPagination
          page={page}
          maxPage={maxPage}
          onChange={setPage}
          size={PAGE_SIZE}
        />
      </FlexChild>
    </>
  );
}
