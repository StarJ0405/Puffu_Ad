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
import { useEffect, useMemo, useState } from "react";
import { toast } from "@/shared/utils/Functions";
import useNavigate from "@/shared/hooks/useNavigate";

export function ContentBox({}: {}) {
  const navigate = useNavigate();
  const [sub, setSub] = useState<any>(null);
  const [plan, setPlan] = useState<any>(null);
  const [benefit, setBenefit] = useState<number>(0);
  const [reserved, setReserved] = useState<any>(null);

  const [loading, setLoading] = useState(false);
  const [paying, setPaying] = useState(false);

  const fmt = (v?: string | Date) =>
    v ? new Date(v).toISOString().slice(0, 10).replaceAll("-", ".") : "-";

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        // 최신 활성 1건
        const my = await requester.getMySubscribes({ latest: true });
        const s = my?.content?.[0] ?? null;
        setSub(s);
        if (!s) return;

        // 기본 플랜 1건
        const pl = await requester.getSubscribe({
          store_id: s.store_id,
          take: 1,
        });
        setPlan(pl?.content?.[0] ?? null);

        // 혜택 합계
        const now = new Date();
        const from = new Date(s.starts_at);
        const benefitRes = await requester.getSubscribeBenefit(s.id, {
          from: from.toISOString(),
          to: now.toISOString(),
        });
        setBenefit(Number(benefitRes?.content?.total || 0));

        const all = await requester.getMySubscribes({
          activeOnly: false,
          order: { starts_at: "ASC" },
          pageSize: 5,
          pageNumber: 0,
        });
        const list: any[] = Array.isArray(all?.content)
          ? all.content
          : all?.content?.content ?? [];
        const nowTs = Date.now();
        const reservedOne = list.find(
          (it) =>
            it?.store_id === s.store_id &&
            it?.canceled_at == null &&
            it?.starts_at &&
            new Date(it.starts_at).getTime() > nowTs
        );
        setReserved(reservedOne || null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const endsAt = sub?.ends_at ? new Date(sub.ends_at) : null;
  const showPay = useMemo(() => {
    if (!endsAt) return false;
    const openAt = new Date(endsAt);
    openAt.setMonth(openAt.getMonth() - 1);
    const now = new Date();
    return now >= openAt && now < endsAt;
  }, [endsAt]);

  const ctaLabel = reserved
    ? "예약 완료"
    : paying
    ? "결제 진행 중…"
    : "결제 진행하기";
  const disabledPay = !!reserved || paying || !plan || !sub;

  const handlePrepay = async () => {
    if (disabledPay) return;
    try {
      setPaying(true);

      const me = await requester.getCurrentUser();
      const user = me?.user;
      if (!user) {
        toast({ message: "로그인이 필요합니다." });
        return;
      }

      const trackId = `${user.id}_${Date.now()}`;
      const amount = Number(plan?.price ?? 0);
      const params = {
        paytype: "nestpay",
        payMethod: "card",
        trackId,
        amount,
        payerId: user.id,
        payerName: user.name,
        payerEmail: user.username,
        payerTel: user.phone,
        returnUrl: `${window.location.origin}/mypage/subscription/success`,
        products: [
          { name: plan?.name || "연간 구독권", qty: 1, price: amount },
        ],
      };
      const result = await requester.requestPaymentApproval(params);

      // NESTPAY 스크립트 로드
      const jsUrl = process.env.NEXT_PUBLIC_STATIC;
      const loadScript = () =>
        new Promise<void>((resolve) => {
          const s = document.createElement("script");
          s.src = jsUrl + "?ver=" + new Date().getTime();
          s.onload = () => resolve();
          document.head.appendChild(s);
        });
      if (!window.NESTPAY) await loadScript();
      if (!window.NESTPAY) {
        toast({ message: "결제 모듈 로드 실패" });
        return;
      }
      window.NESTPAY.welcome();
      window.NESTPAY.pay({
        payMethod: "card",
        trxId: result?.content?.trxId || result?.link?.trxId,
        openType: "layer",
        onApprove: async (resp: any) => {
          if (resp?.resultCd !== "0000") {
            if (resp?.resultCd !== "CB49")
              toast({ message: resp?.resultMsg || "결제 실패" });
            return;
          }
          try {
            // 승인
            const approve = await requester.approvePayment({
              trxId: result?.content?.trxId || result?.link?.trxId,
              resultCd: resp.resultCd,
              resultMsg: resp.resultMsg,
              customerData: JSON.stringify(user),
            });
            const ok =
              approve?.approveResult?.result?.resultCd === "0000" &&
              approve?.approveResult?.pay;

            if (!ok) {
              toast({
                message:
                  approve?.approveResult?.result?.resultMsg || "승인 실패",
              });
              return;
            }

            const optimistic = {
              id: "__optimistic__",
              starts_at: sub?.ends_at,
            };
            setReserved(optimistic);

            const periodDays = Number(plan?.metadata?.periodDays ?? 365);
            const startBase = endsAt ? new Date(endsAt) : new Date();
            const endDate = new Date(
              startBase.getTime() + periodDays * 86400000
            );

            await requester.createSubscribe({
              store_id: sub.store_id,
              name: plan?.name,
              ends_at: endDate.toISOString(),
              payment: approve.approveResult.pay,
            });

            toast({ message: "예약 결제가 완료되었습니다." });
            navigate("/mypage/subscription/manage", { type: "replace" });
          } catch (e: any) {
            setReserved(null);
            toast({ message: e?.error || "승인 처리 오류" });
          }
        },
      });
    } catch (e: any) {
      toast({ message: e?.error || "결제 요청 오류" });
    } finally {
      setPaying(false);
    }
  };

  return (
    <VerticalFlex className={clsx(styles.box_layer)} gap={10}>
      <FlexChild className={styles.period_txt}>
        <Span>현재 이용중</Span>
        <P>
          {fmt(sub?.starts_at)} 시작 ~ {fmt(sub?.ends_at)} 만료
        </P>
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
                <P className={styles.total}>
                  {loading
                    ? "계산 중…"
                    : `${benefit.toLocaleString("ko-KR")}원`}
                </P>
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

            <P className={styles.payment_txt}>
              수동 결제 / 연{" "}
              {Number(plan?.price ?? 49800).toLocaleString("ko-KR")}원
            </P>
          </VerticalFlex>

          <VerticalFlex className={styles.next_payment_box}>
            <P>다음 결제일 : {fmt(sub?.ends_at)}</P>
            <P>(결제일 한달전에 공지)</P>

            <FlexChild
              className={clsx(styles.payment_btn, {
                [styles.disabled]: disabledPay,
              })}
              justifyContent="center"
              hidden={!showPay}
              onClick={handlePrepay}
            >
              {ctaLabel}
            </FlexChild>
          </VerticalFlex>
        </VerticalFlex>
      </FlexChild>
    </VerticalFlex>
  );
}

export function Client() {
  const navigate = useNavigate();
  const [latestId, setLatestId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const r = await requester.getMySubscribes({ latest: true });
      setLatestId(r?.content?.[0]?.id ?? null);
    })();
  }, []);

  const goHistory = () => navigate("/mypage/subscription/history");
  const goCancel = () => {
    if (!latestId) return;
    navigate(`/mypage/subscription/${latestId}/cancel`);
  };

  return (
    <VerticalFlex className={styles.list}>
      <ContentBox />

      <FlexChild
        className={styles.link_btn}
        onClick={goHistory}
      >
        <P>구독 내역 확인</P>

        <Image
          src={"/resources/icons/arrow/mypage_arrow.png"}
          width={10}
          height={"auto"}
        />
      </FlexChild>

      <FlexChild className={styles.link_btn} onClick={goCancel}>
        <P>구독 해지</P>

        <Image
          src={"/resources/icons/arrow/mypage_arrow.png"}
          width={10}
          height={"auto"}
        />
      </FlexChild>
    </VerticalFlex>
  );
}
