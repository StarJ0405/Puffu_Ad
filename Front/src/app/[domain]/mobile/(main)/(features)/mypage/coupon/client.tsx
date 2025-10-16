"use client";
import ProductCard from "@/components/card/ProductCard";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import MasonryGrid from "@/components/masonry/MasonryGrid";
import NoContent from "@/components/noContent/noContent";
import P from "@/components/P/P";
import usePageData from "@/shared/hooks/data/usePageData";
import { requester } from "@/shared/Requester";
import mypage from "../mypage.module.css";
import Span from "@/components/span/Span";
import Image from "@/components/Image/Image";
import Div from "@/components/div/Div";
import styles from "./page.module.css";
import clsx from "clsx";
import { useAuth } from "@/providers/AuthPorivder/AuthPorivderClient";
import Button from "@/components/buttons/Button";
import { useEffect, useState, useRef } from "react";
import useInfiniteData from "@/shared/hooks/data/useInfiniteData";
import CouponItemMobile from "@/components/coupon/couponItemMobile";

export function CouponList({ initCoupons }: { initCoupons: Pageable }) {
  const { userData } = useAuth();
  const { coupons, page, maxPage, Load, setPage } = useInfiniteData(
    "coupons",
    (pageNumber) => ({
      pageNumber,
      pageSize: 5,
    }),
    (condition) => requester.getCoupons(condition),
    (data: Pageable) => data?.totalPages || 0,
    {
      fallbackData: [initCoupons],
      onReprocessing: (data) => data?.content || [],
    }
  );
  useEffect(() => {
    setPage(0)
  }, []);
  const showMore = () => {
    Load();
  };

  return (
    <>
      <HorizontalFlex className={mypage.box_header} justifyContent="flex-start">
        <P>사용 가능 쿠폰</P>
        <P className={styles.total_count}>
          <Span>{userData?.coupon}</Span>
        </P>
      </HorizontalFlex>
      {coupons?.length > 0 ? (
        <VerticalFlex gap={15}>
          {coupons?.map((coupon: CouponData) => (
            <CouponItemMobile key={coupon.id} coupon={coupon} />
          ))}
          <Button
            className={styles.list_more_btn}
            hidden={maxPage < 1 || page >= maxPage}
            onClick={showMore}
          >
            쿠폰 더보기
          </Button>
        </VerticalFlex>
      ) : (
        <NoContent type="쿠폰" />
      )}
    </>
  );
}
