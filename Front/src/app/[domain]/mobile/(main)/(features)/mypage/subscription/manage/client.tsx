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
import Div from "@/components/div/Div";

export function ContentBox({}: {}) {
  return (
    <VerticalFlex className={clsx(styles.box_layer)} gap={10}>
      <FlexChild className={styles.period_txt}>
        <Span>현재 이용중</Span>

        <P>2025.09.01 시작 ~ 2026.09.01 만료</P>
      </FlexChild>

      <FlexChild className={styles.premium_layer}>
        <VerticalFlex className={styles.premium_box}>
          <VerticalFlex className={styles.itemBox}>
            <FlexChild className={styles.service_Title} justifyContent="center">
              <Div className={styles.premium_mark}>
                <Div>premium</Div>
              </Div>

              <P>연간 구독 서비스</P>
            </FlexChild>

            <VerticalFlex className={styles.item_content}>
              <VerticalFlex className={styles.cumulative}>
                <FlexChild justifyContent="center" className={styles.txt}>
                  <P>지금까지 혜택 받은 금액</P>

                  <Image
                    src={"/resources/icons/mypage/subscription_heart.png"}
                    width={20}
                    height={"auto"}
                  />
                </FlexChild>

                <P className={styles.total}>300,000원</P>
              </VerticalFlex>

              <VerticalFlex className={styles.unit} alignItems="start">
                <FlexChild>
                  <Image
                    src={"/resources/icons/arrow/checkBox_check.png"}
                    width={13}
                    height={"auto"}
                  />
                  <P>
                    전제품 <Span>10% 상시 할인</Span>
                  </P>
                </FlexChild>

                <FlexChild>
                  <Image
                    src={"/resources/icons/arrow/checkBox_check.png"}
                    width={13}
                    height={"auto"}
                  />
                  <P>
                    매월 프리 머니 <Span>10,000원</Span> 쿠폰 지급
                  </P>
                </FlexChild>
              </VerticalFlex>
            </VerticalFlex>

            <P className={styles.payment_txt}>수동 결제 / 연 49,800원</P>
          </VerticalFlex>

          <VerticalFlex className={styles.next_payment_box}>
            <P>다음 결제일 : 2026.09.01</P>
            <P>(결제일 한달전에 공지)</P>

            {/* 결제 한달 전에만 나오기 */}
            <FlexChild
              className={styles.payment_btn}
              justifyContent="center"
              hidden
            >
              결제 진행하기
            </FlexChild>
          </VerticalFlex>
        </VerticalFlex>
      </FlexChild>
    </VerticalFlex>
  );
}
