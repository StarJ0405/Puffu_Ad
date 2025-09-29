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
import styles from './page.module.css'

export function CouponList() {

  const test = [
    {name : '리얼 후기왕 선정 30% 할인쿠폰', date: ' 2025-11-20'},
    {name : '리얼 후기왕 선정 30% 할인쿠폰', date: ' 2025-11-20'},
    {name : '리얼 후기왕 선정 30% 할인쿠폰', date: ' 2025-11-20'},
    {name : '리얼 후기왕 선정 30% 할인쿠폰', date: ' 2025-11-20'},
    {name : '리얼 후기왕 선정 30% 할인쿠폰', date: ' 2025-11-20'},
  ]

  return (
    <>
      <HorizontalFlex className={mypage.box_header}>
        <P>전체 상품</P>
        <Span className={styles.total_count}>3</Span>
      </HorizontalFlex>
      {test.length > 0 ? (
        <VerticalFlex>
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
  return (
    <FlexChild className={styles.item}>
      <VerticalFlex>
        <P className={styles.name}>{item.name}</P>
        <P className={styles.date}>사용기간 {item.date} 까지</P>
      </VerticalFlex>

      <FlexChild>
        
      </FlexChild>
    </FlexChild>
  )
}
