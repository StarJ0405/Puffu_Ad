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
import { requester } from "@/shared/Requester";
import { useEffect, useState } from "react";

export function ContentBox({}: {}) {
  const [subId, setSubId] = useState<string | null>(null);
  const [benefit, setBenefit] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<any>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const r = await requester.getMySubscribes({ latest: true });
        const s = r?.content?.[0];
        const id = s?.id ?? null;

        setSubId(id);
        // 기본 플랜 1건
        const pl = await requester.getSubscribe({
          store_id: s.store_id,
          take: 1,
        });
        setPlan(pl?.content?.[0] || null);


        if (id) {
          const now = new Date();
          const from = new Date(
            now.getFullYear(),
            now.getMonth(),
            1
          ).toISOString();
          const to = now.toISOString();
          const b = await requester.getSubscribeBenefit(id, { from, to });
          setBenefit(Number(b?.content?.total || 0));
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <VerticalFlex className={clsx(styles.box_layer)} gap={10}>
      <FlexChild className={styles.premium_layer}>
        <VerticalFlex className={styles.premium_box}>
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
                {loading ? "계산 중…" : `${benefit.toLocaleString("ko-KR")}원`}
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
                  전제품 <Span>{(plan?.percent || 0).toLocaleString()}% 상시 할인</Span>
                </P>
              </FlexChild>

              <FlexChild>
                <Image
                  src={"/resources/icons/arrow/checkBox_check.png"}
                  width={13}
                  height={"auto"}
                />
                <P>
                  매월 프리 머니 <Span>{(plan?.value || 0).toLocaleString()}원</Span> 쿠폰 지급
                </P>
              </FlexChild>
            </VerticalFlex>
          </VerticalFlex>
        </VerticalFlex>
      </FlexChild>
    </VerticalFlex>
  );
}

export function ConfirmBtn({}: {}) {
  const navigate = useNavigate();

  const openCancelFlow = () => {
    NiceModal.show(ConfirmModal, {
      message: (
        <FlexChild justifyContent="center" marginBottom={30}>
          <P color="#fff" fontSize={20} weight={600}>
            구독 서비스를 해지하시겠습니까?
          </P>
        </FlexChild>
      ),
      classNames: {
        title: "confirm_title",
      },
      backgroundColor: "var(--confirmModal-bg)",
      confirmText: "해지하기",
      cancelText: "취소",
      withCloseButton: false,
      preventable: true,
      onConfirm: async () => {
        // 1) 최신 구독
        const subs = await requester.getMySubscribes({ latest: true });
        const subId = subs?.content?.[0]?.id;
        if (!subId) {
          toast({ message: "활성 구독이 없습니다." });
          return false;
        }

        // 2) 견적
        const quote = await requester.getSubscribeRefundQuote(subId, {});
        const refund = Number(quote?.content?.refund || 0);

        // 3) 첫 모달 닫고(반드시 true 리턴), 다음 틱에 두 번째 모달 오픈
        setTimeout(() => {
          NiceModal.show(ConfirmModal, {
            message: (
              <VerticalFlex gap={10} justifyContent="center" marginBottom={20}>
                <P color="#fff" fontSize={18} weight={600}>
                  환불 예상액 {refund.toLocaleString("ko-KR")}원
                </P>
                <P color="#666" fontSize={14}>
                  해지를 진행하시겠습니까?
                </P>
              </VerticalFlex>
            ),
            classNames: {
              title: "confirm_title",
            },
            backgroundColor: "var(--confirmModal-bg)",
            confirmText: "확인",
            cancelText: "취소",
            withCloseButton: false,
            preventable: true,
            onConfirm: async () => {
              try {
                await requester.postSubscribeRefund(subId, { refund });
                toast({ message: "해지가 완료되었습니다." });
                navigate("/mypage/subscription/subscribe", { type: "replace" });
                return true; // 두 번째 모달 닫기
              } catch (e: any) {
                toast({ message: e?.error || "처리 중 오류가 발생했습니다." });
                return false;
              }
            },
          });
        }, 0);

        return true; // 첫 모달 즉시 닫힘. 스피너 멈춤.
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

      <FlexChild className={styles.delete_btn} onClick={openCancelFlow}>
        <Button>회원권 해지하기</Button>
      </FlexChild>
    </VerticalFlex>
  );
}
