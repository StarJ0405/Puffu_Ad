"use client";
import Button from "@/components/buttons/Button";
import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import ConfirmModal from "@/modals/confirm/ConfirmModal";
import useNavigate from "@/shared/hooks/useNavigate";
import NiceModal from "@ebay/nice-modal-react";
import clsx from "clsx";
import styles from "./page.module.css";
import { toast } from "@/shared/utils/Functions";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import { requester } from "@/shared/Requester";
import { useEffect, useState, useMemo } from "react";

type SubscribeRow = {
  id: string;
  starts_at?: string;
  ends_at?: string;
  store_id?: string;
};

export function ContentBox({
  initSubscribe,
}: {
  initSubscribe: SubscribeRow | null;
}) {
  const [benefit, setBenefit] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const subId = initSubscribe?.id ?? null;
  const period = useMemo(() => {
    const s = initSubscribe?.starts_at
      ? new Date(initSubscribe.starts_at)
      : null;
    const e = initSubscribe?.ends_at ? new Date(initSubscribe.ends_at) : null;
    return { s, e };
  }, [initSubscribe]);

  useEffect(() => {
    (async () => {
      if (!subId || !period.s) return;
      setLoading(true);
      try {
        const now = new Date();
        const to = period.e
          ? new Date(Math.min(period.e.getTime(), now.getTime()))
          : now;
        const r = await requester.getSubscribeBenefit(subId, {
          from: period.s.toISOString(),
          to: to.toISOString(),
        });
        setBenefit(Number(r?.content?.total || 0));
      } finally {
        setLoading(false);
      }
    })();
  }, [subId, period]);

  return (
    <VerticalFlex className={clsx(styles.box_layer)}>
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

          <P className={styles.total}>
            {loading ? "계산 중…" : `${benefit.toLocaleString("ko-KR")}원`}
          </P>
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
            전제품 <Span>10% 할인</Span>
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
            프리 머니 <Span>10,000원</Span> 쿠폰
          </P>
        </VerticalFlex>
      </FlexChild>
    </VerticalFlex>
  );
}

export function ConfirmBtn({
  initSubscribe,
}: {
  initSubscribe: SubscribeRow | null;
}) {
  const navigate = useNavigate();
  const subId = initSubscribe?.id ?? null;

  const openCancelFlow = () => {
    if (!subId) {
      toast({ message: "구독 정보를 확인할 수 없습니다." });
      return;
    }

    NiceModal.show(ConfirmModal, {
      message: (
        <FlexChild justifyContent="center" marginBottom={20}>
          <P color="#fff" fontSize={16} weight={600} textAlign="center" lineHeight={1.4}>
            활성 구독을 해지하면, <br /> 
            예약된 다음 구독도 함께 취소·환불됩니다.
          </P>
        </FlexChild>
      ),
      classNames: {
        title: "confirm_title",
      },
      title: "구독 해지",
      backgroundColor: "var(--confirmModal-bg)",
      confirmText: "해지하기",
      cancelText: "취소",
      withCloseButton: true,
      preventable: true,
      onConfirm: async () => {
        // 첫 모달은 바로 닫는다
        setTimeout(async () => {
          try {
            const quote = await requester.getSubscribeRefundQuote(subId, {});
            const refund = Number(quote?.content?.refund || 0);

            NiceModal.show(ConfirmModal, {
              message: (
                <VerticalFlex gap={20} justifyContent="center" marginBottom={20}>
                  <P color="#ccc" fontSize={16} weight={600}>
                    환불 예상액 {refund.toLocaleString("ko-KR")}원
                  </P>
                  <P color="#fff" fontSize={18}>
                    해지를 진행하시겠습니까?
                  </P>
                </VerticalFlex>
              ),
              classNames: {
                title: "confirm_title",
              },
              title: "구독 해지",
              backgroundColor: "var(--confirmModal-bg)",
              confirmText: "확인",
              cancelText: "취소",
              withCloseButton: true,
              preventable: true,
              onConfirm: async () => {
                try {
                  const r = await requester.postSubscribeRefund(subId, {}); // 본결제 + 다음 예약까지 일괄 처리
                  const total = Number(r?.content?.total_refund ?? 0);
                  const cnt = Array.isArray(r?.content?.refunds)
                    ? r.content.refunds.length
                    : 0;
                  // await NiceModal.show(ConfirmModal, {
                  //   message: (
                  //     <FlexChild justifyContent="center" marginBottom={20}>
                  //       <P color="#fff" fontSize={16} weight={600} textAlign="center" lineHeight={1.4}>
                  //         해지가 완료되었습니다. <br /> 
                  //         환불합계 {total.toLocaleString("ko-KR")}원{cnt > 1 ? ` / ${cnt}건` : ""}
                  //       </P>
                  //     </FlexChild>
                  //   ),
                  //   classNames: {
                  //     title: "confirm_title",
                  //   },
                  //   title: "구독 해지",
                  //   backgroundColor: "var(--confirmModal-bg)",
                  //   confirmText: "확인",
                  //   // cancelText: "취소",
                  //   withCloseButton: true,
                  //   preventable: true,
                  //   onConfirm: async () => {
                  //     navigate('/');
                  //   }
                  // });
                  toast({
                    message: `해지 완료. 환불합계 ${total.toLocaleString(
                      "ko-KR"
                    )}원${cnt > 1 ? ` / ${cnt}건` : ""}`,
                  });
                  setTimeout(() => {
                    navigate('/');
                    // navigate(`/mypage?ts=${Date.now()}`, { type: "replace" });
                  }, 1500);
                  return true;
                } catch (e: any) {
                  toast({
                    message: e?.error || "처리 중 오류가 발생했습니다.",
                  });
                  return false;
                }
              },
            });
          } catch (e: any) {
            toast({ message: e?.error || "견적 조회에 실패했습니다." });
          }
        }, 0);

        return true;
      },
    });
  };

  return (
    <VerticalFlex className={styles.confirm_box}>
      <FlexChild
        onClick={() => navigate("/mypage/subscription/manage")}
        className={styles.continue_btn}
      >
        <Button>회원권 계속 유지하기</Button>
      </FlexChild>

      {/* onClick={()=> ()} */}
      <FlexChild className={styles.delete_btn} onClick={openCancelFlow}>
        <Button>회원권 해지하기</Button>
      </FlexChild>
    </VerticalFlex>
  );
}
