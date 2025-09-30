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
import styles from './page.module.css'
import clsx from "clsx";

export function CouponList() {

  const test = [
    { name: '리얼 후기왕 선정 30% 할인쿠폰', date: ' 2025-11-20', expired: false, used: false },
    { name: '리얼 후기왕 선정 30% 할인쿠폰', date: ' 2025-11-20', expired: false, used: false },
    { name: '리얼 후기왕 선정 30% 할인쿠폰', date: ' 2025-11-20', expired: false, used: false },
    { name: '리얼 후기왕 선정 30% 할인쿠폰', date: ' 2025-11-20', expired: true, used: false },
    { name: '리얼 후기왕 선정 30% 할인쿠폰', date: ' 2025-11-20', expired: false, used: true },
  ]

  return (
    <>
      <HorizontalFlex className={mypage.box_header} justifyContent="flex-start">
        <P>사용 가능 쿠폰</P>
        <P className={styles.total_count}>
          <Span>3</Span>
        </P>
      </HorizontalFlex>
      {test.length > 0 ? (
        <VerticalFlex gap={15}>
          {test.map((item, i) => {

            return (
              <CouponCard
                key={i}
                item={item}
              />
            );
          })}
        </VerticalFlex>
      ) : (
        <NoContent type="상품" />
      )}
    </>
  );
}


function CouponCard({
  item
}: {
  item: any;
}) {
  const isExpired = item.expired;
  const isUsed = item.used;
  return (
    <FlexChild className={clsx(styles.item, isExpired && styles.expired, isUsed && styles.used)}>
      <HorizontalFlex>
        <VerticalFlex gap={10} padding={"20px 0 20px 15px"} alignItems="flex-start">
          <P className={clsx(styles.name, isExpired && styles.expired, isUsed && styles.used)}>{item.name}</P>
          <P className={clsx(styles.date, isExpired && styles.expired, isUsed && styles.used)}>사용기간 {item.date} 까지</P>
        </VerticalFlex>

        <FlexChild className={styles.cutout_wrap}>
          <Div className={styles.cutout_left} />
          <Div className={styles.cutout_right} />
          <Div className={styles.dashed_line} />
          <Div className={styles.spacer} />
        </FlexChild>

        <FlexChild className={styles.icon_wrap} width={"fit-content"}>
          {isUsed ? (
            <P className={styles.txt}>
              사용<br />완료
            </P>
          ) : isExpired ? (
            <P className={styles.txt}>
              기간<br />만료
            </P>
          ) : (
            <Image
              src="/resources/icons/mypage/coupon_pink_icon.png"
              width={30}
              alt="쿠폰 아이콘"
            />
          )}
        </FlexChild>

      </HorizontalFlex>
    </FlexChild>
  )
}
