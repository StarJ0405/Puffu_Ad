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

export function CouponList({ initCoupons }: { initCoupons: Pageable }) {
  const { userData } = useAuth();
  const { coupons, page, maxPage, setPage, origin } = usePageData(
    "coupons",
    (pageNumber) => ({
      pageNumber,
      pageSize: 12,
    }),
    (condition) => requester.getCoupons(condition),
    (data: Pageable) => data?.totalPages || 0,
    {
      fallbackData: initCoupons,
      onReprocessing: (data) => data?.content || [],
    }
  );

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
      <table className={styles.coupon_list}>
        <colgroup>
          <col style={{ width: "15%",}} />
          <col style={{ width: "15%",}} />
          <col style={{ width: "35%" }} />
          <col style={{ width: "20%",}} />
          <col style={{ width: "15%",}} />
        </colgroup>

        {/* 게시판리스트 헤더 */}
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
            coupons?.map((coupon: CouponData) => (
              <CouponItemDesktop coupon={coupon} key={coupon.id} />
            ))
          ) : (
            <tr>
              <NoContent type="쿠폰" />
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
