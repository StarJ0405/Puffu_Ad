"use client";
import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import clsx from "clsx";
import styles from "./page.module.css";
import Image from "@/components/Image/Image";
import Div from "@/components/div/Div";
import { requester } from "@/shared/Requester";
import { useEffect, useState } from "react";

export function ContentBox({}: {}) {
  const [sub, setSub] = useState<any>(null);
  const [plan, setPlan] = useState<any>(null);
  const [benefit, setBenefit] = useState<number>(0);

  const fmt = (v?: string | Date) =>
    v ? new Date(v).toISOString().slice(0, 10).replaceAll("-", ".") : "-";

  useEffect(() => {
    (async () => {
      // 최신 구독 1건
      const my = await requester.getMySubscribes({ latest: true });
      const s = my?.content?.[0];
      setSub(s || null);
      if (!s) return;

      // 기본 플랜 1건
      const pl = await requester.getSubscribe({ store_id: s.store_id, take: 1 });
      setPlan(pl?.content?.[0] || null);

      // 혜택 합계(퍼센트+구독쿠폰) 서버 계산
      const now = new Date();
      const from = new Date(s.starts_at);
      const benefitRes = await requester.getSubscribeBenefit(s.id, {
        from: from.toISOString(),
        to: now.toISOString(),
      });
      setBenefit(Number(benefitRes?.content?.total || 0));
    })();
  }, []);

  return (
    <VerticalFlex className={clsx(styles.box_layer)} gap={10}>
      <FlexChild className={styles.period_txt}>
        <Span>현재 이용중</Span>
        <P>{fmt(sub?.starts_at)} 시작 ~ {fmt(sub?.ends_at)} 만료</P>
      </FlexChild>

      <FlexChild className={styles.premium_layer}>
        <VerticalFlex className={styles.premium_box}>
          <VerticalFlex className={styles.itemBox}>
            <FlexChild className={styles.service_Title} justifyContent="center">
              <Div className={styles.premium_mark}><Div>premium</Div></Div>
              <P>연간 구독 서비스</P>
            </FlexChild>

            <VerticalFlex className={styles.item_content}>
              <VerticalFlex className={styles.cumulative}>
                <FlexChild justifyContent="center" className={styles.txt}>
                  <P>지금까지 혜택 받은 금액</P>
                  <Image src={"/resources/icons/mypage/subscription_heart.png"} width={20} height={"auto"} />
                </FlexChild>
                <P className={styles.total}>{benefit.toLocaleString("ko-KR")}원</P>
              </VerticalFlex>

              <VerticalFlex className={styles.unit} alignItems="start">
                <FlexChild>
                  <Image src={"/resources/icons/arrow/checkBox_check.png"} width={13} height={"auto"} />
                  <P>전제품 <Span>10% 상시 할인</Span></P>
                </FlexChild>
                <FlexChild>
                  <Image src={"/resources/icons/arrow/checkBox_check.png"} width={13} height={"auto"} />
                  <P>매월 프리 머니 <Span>10,000원</Span> 쿠폰 지급</P>
                </FlexChild>
              </VerticalFlex>
            </VerticalFlex>

            <P className={styles.payment_txt}>
              수동 결제 / 연 {Number(plan?.price ?? 49800).toLocaleString("ko-KR")}원
            </P>
          </VerticalFlex>

          <VerticalFlex className={styles.next_payment_box}>
            <P>다음 결제일 : {fmt(sub?.ends_at)}</P>
            <P>(결제일 한달전에 공지)</P>
            <FlexChild className={styles.payment_btn} justifyContent="center" hidden>
              결제 진행하기
            </FlexChild>
          </VerticalFlex>
        </VerticalFlex>
      </FlexChild>
    </VerticalFlex>
  );
}
