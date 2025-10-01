"use client";
import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import P from "@/components/P/P";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import Span from "@/components/span/Span";
import Image from "@/components/Image/Image";
import clsx from "clsx";
import styles from "./page.module.css";

export function PointDetail() {
  const isUsed = true;
  const test = [
    {
      store: "푸푸토이",
      title: "[손가락 콘돔] 핑돔 1box 24pcs (Findom 1box) - FD24 (ALC)",
      count: "2",
      price: "34,900",
    },
  ];

  return (
    <VerticalFlex className={styles.point_detail} alignItems="flex-start" gap={20}>
      <P className={styles.date}>2025년 9월 1일 13:30</P>
      {isUsed ? (
        <>
          {test.map((item, index) => {
            return (
              <FlexChild
                key={index}
                borderBottom={"1px solid #797979"}
                paddingBottom={15}
              >
                <HorizontalFlex gap={7} alignItems="flex-start">
                  <FlexChild width={"fit-content"}>
                    <Image src="/resources/icons/mypage/user_no_img.png" width={66} />
                  </FlexChild>
                  <VerticalFlex alignItems="flex-start" gap={10}>
                    <P className={styles.store}>{item.store}</P>
                    <P className={styles.title}>{item.title}</P>
                    <P className={styles.option}>
                      <Span>{item.count}</Span>
                      <Span>개</Span>
                      <Span> / </Span>
                      <Span>{item.price}</Span>
                      <Span>원</Span>
                    </P>
                  </VerticalFlex>
                </HorizontalFlex>
              </FlexChild>
            )
          })}
        </>
      ) : (
        <>
          <FlexChild
            borderBottom={"1px solid #797979"}
            padding={"20px 0 15px 0"}>
            <P>초보자 등급 적립금</P>
          </FlexChild>
        </>
      )}

      <FlexChild>
        <VerticalFlex>
          <HorizontalFlex className={styles.point_box}>
            <P>
              {isUsed ? "사용포인트" : "적립포인트"}
            </P>
            <P className={clsx(styles.point, {
              [styles.used]: isUsed,
            })}>
              <Span>{isUsed ? "-" : "+"}</Span>
              <Span>1,000</Span>
              <Span>P</Span>
            </P>
          </HorizontalFlex>
          <HorizontalFlex justifyContent="flex-end">
            <P className={styles.points_balance_txt}>
              <Span>잔액 </Span>
              <Span>9,860</Span>
              <Span>P</Span>
            </P>
          </HorizontalFlex>
        </VerticalFlex>
      </FlexChild>
    </VerticalFlex>

  )
}