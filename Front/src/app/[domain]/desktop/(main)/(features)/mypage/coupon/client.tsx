"use client";
import Div from "@/components/div/Div";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import NoContent from "@/components/noContent/noContent";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import { useAuth } from "@/providers/AuthPorivder/AuthPorivderClient";
import usePageData from "@/shared/hooks/data/usePageData";
import { requester } from "@/shared/Requester";
import clsx from "clsx";
import mypage from "../mypage.module.css";
import styles from "./page.module.css";
import ListPagination from "@/components/listPagination/ListPagination";
import CouponItemDesktop from "@/components/coupon/couponItemDesktop";
import { useState, useMemo } from "react";

type FilterKey = "all" | "item" | "order" | "shipping" | "expired";

export function CouponList({ initCoupons }: { initCoupons: Pageable }) {
  const { userData } = useAuth();
  const [filter, setFilter] = useState<FilterKey>("all");

  const where = useMemo(() => {
    switch (filter) {
      case "item":
        return { type: "item" };
      case "order":
        return { type: "order" };
      case "shipping":
        return { type: "shipping" };
      case "expired":
        return { status: "expired" }; // status 종류:
      // - "expired"      → 기간만료 + 사용만료 전체
      // - "expired_date" → 기간만료만 (미사용)
      // - "expired_used" → 사용된 쿠폰만 (기간무관)
      default:
        return {};
    }
  }, [filter]);

  const { coupons, page, maxPage, setPage } = usePageData(
    "coupons",
    (pageNumber) => ({ pageNumber, pageSize: 12, ...where }),
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

  const onTabClick = (k: FilterKey) => {
    if (k !== filter) setPage(0);
    setFilter(k);
  };
  return (
    <VerticalFlex className={clsx(mypage.box_frame, styles.coupon_box)}>
      <HorizontalFlex className={mypage.box_header}>
        <P>쿠폰함</P>
        <FlexChild className={mypage.header_subTitle}>
          <P paddingRight={10}>사용 가능 쿠폰</P>
          <P className={styles.total_count}>
            <Span>{userData?.coupon}</Span>
          </P>
        </FlexChild>
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
            {t.label}
            {t.key === "all" && <>({userData?.coupon ?? 0})</>}
          </P>
        ))}
      </HorizontalFlex>
      <table className={styles.coupon_list}>
        <colgroup>
          <col style={{ width: "15%" }} />
          <col style={{ width: "15%" }} />
          <col style={{ width: "35%" }} />
          <col style={{ width: "20%" }} />
          <col style={{ width: "15%" }} />
        </colgroup>
        <thead>
          <tr className={styles.table_header}>
            <th>구분</th>
            <th>혜택</th>
            <th>쿠폰명</th>
            <th>사용조건</th>
            <th>사용기간</th>
          </tr>
        </thead>
        <tbody>
          {coupons?.length > 0 ? (
            coupons.map((c: CouponData) => (
              <CouponItemDesktop coupon={c} key={c.id} />
            ))
          ) : (
            <tr>
              <td colSpan={5}>
                <NoContent type="쿠폰" />
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <FlexChild>
        <ListPagination
          page={page}
          maxPage={maxPage}
          onChange={setPage}
          size={5}
        />
      </FlexChild>
    </VerticalFlex>
  );
}
