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
import Image from "@/components/Image/Image";


export function ContentBox({ }: {  }) {
  
  return (
    <VerticalFlex className={clsx(styles.premiumBox, styles.itemBox)}>
      <FlexChild className={styles.payment_txt} justifyContent="center">
        <P>￦{(49800).toLocaleString()} / 년</P>
      </FlexChild>

      <VerticalFlex className={styles.item_content}>
        <VerticalFlex className={styles.unit}>
          <FlexChild gap={5} justifyContent="center">
            <Image
              src={"/resources/icons/mypage/subscription_sale.png"}
              width={20} height={'auto'}
            />
            <P>전제품 <Span>10% 상시 할인</Span></P>
          </FlexChild>

          <P className={styles.text1}>
            푸푸토이의 모든 제품이 <br/>
            언제나 10% 할인가로 적용됩니다.
          </P>
        </VerticalFlex>

        <VerticalFlex className={styles.unit}>
          <FlexChild gap={5} justifyContent="center">
            <Image
              src={"/resources/icons/mypage/subscription_coupon.png"}
              width={20} height={'auto'}
            />
            <P>매월 프리머니 <Span>10,000원</Span> 쿠폰 지급</P>
          </FlexChild>

          <P className={styles.text1}>
            매달 사용 가능한 1만원 <br/>
            프리머니 쿠폰 상시 지급
          </P>
        </VerticalFlex>
      </VerticalFlex>
    </VerticalFlex>
  );
}
