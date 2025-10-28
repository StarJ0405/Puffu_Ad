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
import styles from "./page.module.css";
import clsx from "clsx";
import Image from "@/components/Image/Image";
import Div from "@/components/div/Div";
import mypage from "../../../mypage.module.css";

export function BoxHeader() {
  const [sub, setSub] = useState<any>(null);

  const fmt = (v?: string | Date) =>
    v ? new Date(v).toISOString().slice(0, 10).replaceAll("-", ".") : "-";

  useEffect(() => {
    (async () => {
      // 최신 구독 1건
      const my = await requester.getMySubscribes({ latest: true });
      const s = my?.content?.[0];
      setSub(s || null);
      if (!s) return;
    })();
  }, []);

  return (
    <FlexChild className={clsx(mypage.box_header, styles.manage_header)}>
      <FlexChild gap={8} width={"auto"}>
        <Div className={styles.premium_mark}>
          <Div>premium</Div>
        </Div>

        <P>연간 구독 서비스</P>
      </FlexChild>

      <P className={styles.date_txt}>
        {fmt(sub?.starts_at)} 시작 ~ {fmt(sub?.ends_at)} 만료
      </P>
    </FlexChild>
  );
}

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
      const pl = await requester.getSubscribe({
        store_id: s.store_id,
        take: 1,
      });
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

  const endsAt = sub?.ends_at ? new Date(sub.ends_at) : null;
  const showPay = (() => {
    if (!endsAt) return false;
    const openAt = new Date(endsAt);
    openAt.setMonth(openAt.getMonth() - 1);
    const now = new Date();
    return now >= openAt && now < endsAt;
  })();

  return (
    <>
      <P alignSelf="start" fontSize={16} color="#fff">
        다음 결제 예정일은 {fmt(sub?.ends_at)}입니다. (결제일 한달전에 공지)
        <Span verticalAlign={"baseline"} fontSize={13} paddingLeft={5}>
          수동 결제 / 연 {Number(plan?.price ?? 49800).toLocaleString("ko-KR")}
          원
        </Span>
      </P>
      <VerticalFlex className={clsx(styles.box_layer)}>
        <FlexChild
          className={styles.payment_btn}
          justifyContent="center"
          // hidden={!showPay}
        >
          결제 진행하기
        </FlexChild>
        <FlexChild className={styles.premium_layer}>
          <VerticalFlex className={styles.cumulative}>
            <HorizontalFlex className={styles.txt} alignItems="start">
              <P>지금까지 혜택 받은 금액</P>

              <Image
                src={"/resources/icons/mypage/subscription_heart.png"}
                width={40}
                height={"auto"}
              />
            </HorizontalFlex>

            <P className={styles.total}>{benefit.toLocaleString("ko-KR")}원</P>
          </VerticalFlex>
        </FlexChild>

        <FlexChild className={styles.unit} alignItems="start">
          <VerticalFlex className={styles.unit_item}>
            <Image
              src={"/resources/images/mypage/subscription_cancel_sale_pc.png"}
              width={98}
              height={"auto"}
            />

            <P>
              365일간 누리는 <br />
              전제품 <Span>{(plan?.percent || 0).toLocaleString()}% 할인</Span>
            </P>
          </VerticalFlex>

          <VerticalFlex className={styles.unit_item}>
            <Image
              src={"/resources/images/mypage/subscription_cancel_coupon_pc.png"}
              width={112}
              height={"auto"}
            />

            <P>
              매월 지급되는 <br />
              프리 머니 <Span>{(plan?.value || 0).toLocaleString()}원</Span> 쿠폰
            </P>
          </VerticalFlex>
        </FlexChild>
      </VerticalFlex>
    </>
  );
}
