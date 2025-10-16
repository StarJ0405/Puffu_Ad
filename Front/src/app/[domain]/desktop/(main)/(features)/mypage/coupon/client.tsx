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
import CouponItem from "@/components/coupon/couponItem";

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
      <FlexChild minHeight={400} alignItems="flex-start">
        {coupons?.length > 0 ? (
          <HorizontalFlex gap={15} flexWrap="wrap" justifyContent="flex-start">
            {coupons?.map((coupon: CouponData) => (
              <CouponItem key={coupon.id} coupon={coupon} />
            ))}
          </HorizontalFlex>
        ) : (
          <NoContent type="쿠폰" />
        )}
      </FlexChild>
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
