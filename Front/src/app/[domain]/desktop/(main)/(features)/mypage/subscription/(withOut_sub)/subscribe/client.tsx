"use client";
import Button from "@/components/buttons/Button";
import CheckboxChild from "@/components/choice/checkbox/CheckboxChild";
import CheckboxGroup from "@/components/choice/checkbox/CheckboxGroup";
import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import useNavigate from "@/shared/hooks/useNavigate";
import { toast } from "@/shared/utils/Functions";
import NiceModal from "@ebay/nice-modal-react";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { requester } from "@/shared/Requester";
import { useStore } from "@/providers/StoreProvider/StorePorivderClient";
import styles from "./page.module.css";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import LoadingPageChange from "@/components/loading/LoadingPageChange";

export function ContentBox({}: {}) {
  const [plan, setPlan] = useState<SubscribeData | null>(null);
  const { storeData } = useStore();
  const storeId = storeData?.id;

  useEffect(() => {
    if (!storeId) return;
    (async () => {
      const { content } = await requester.getSubscribe({ store_id: storeId });
      setPlan(content?.[0] ?? null);
    })();
  }, [storeId]);

  const price = plan?.price;

  // console.log('구독', plan);

  return (
    <VerticalFlex className={clsx(styles.premiumBox, styles.itemBox)}>
      <FlexChild className={styles.payment_txt} justifyContent="center">
        <P>￦{Number(price || 0).toLocaleString()} / 년</P>
      </FlexChild>

      <VerticalFlex className={styles.item_content}>
        <VerticalFlex className={styles.unit}>
          <FlexChild gap={5} justifyContent="center" className={styles.unit_title}>
            <Image
              src={"/resources/images/mypage/subscription_cancel_sale_pc.png"}
              width={40}
              height={"auto"}
            />
            <P>
              전제품 <Span>{plan?.percent}% 상시 할인</Span>
            </P>
          </FlexChild>

          <P className={styles.text1}>
            푸푸토이의 모든 제품이 <br />
            언제나 {plan?.percent}% 할인가로 적용됩니다.
          </P>
        </VerticalFlex>

        <FlexChild justifyContent="center">
          <P size={45} lineHeight={1} fontWeight={300}>+</P>
        </FlexChild>

        <VerticalFlex className={styles.unit}>
          <FlexChild gap={5} justifyContent="center">
            <Image
              src={"/resources/images/mypage/subscription_cancel_coupon_pc.png"}
              width={40}
              height={"auto"}
            />
            <P className={styles.unit_title}>
              매월 프리머니 <Span verticalAlign={'baseline'}>{(plan?.value || 0).toLocaleString()}원</Span> 쿠폰 지급
            </P>
          </FlexChild>

          <P className={styles.text1}>
            매달 사용 가능한 1만원 <br />
            프리머니 쿠폰 상시 지급
          </P>
        </VerticalFlex>
      </VerticalFlex>
    </VerticalFlex>
  );
}

export function CheckConfirm() {
  const [isAgree, setIsAgree] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [plan, setPlan] = useState<SubscribeData | null>(null);
  const { storeData } = useStore();
  const storeId = storeData?.id;

  useEffect(() => {
    if (!storeId) return;
    (async () => {
      const { content } = await requester.getSubscribe({ store_id: storeId });
      setPlan(content?.[0] ?? null);
    })();
  }, [storeId]);

  const price = plan?.price;

  const showModal = (type: "term_check" | "privacy_check") => {
    NiceModal.show("AgreeContent", { type, onlyView: true, width: '500px', height: '70vh'});
  };

  // 결제창 취소했을때 hidden 막는 용도
  if (typeof window !== "undefined" && typeof MutationObserver !== "undefined") {
    const observer = new MutationObserver(() => {
      const html = document.documentElement;
      const body = document.body;

      if (html.style.overflow === "hidden") {
        html.style.overflow = "";
      }
      if (body.style.overflow === "hidden") {
        body.style.overflow = "";
      }
    });

    // body style 바뀌는 거 계속 감시
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["style"],
    });
  }

  const [ShowLoadingComp, setShowLoadingComp] = useState(false);

  // 결제 버튼
  const handlePaymentSubmit = async () => {
    
    if (loading) return;
    setLoading(true);
    if (isAgree.length === 0) {
      toast({ message: "서비스 이용약관에 동의해주세요." });
      setLoading(false);
      return;
    }

    try {
      const user = await requester.getCurrentUser();
      const userData = user?.user;
      if (!userData) {
        toast({ message: "로그인이 필요합니다." });
        return;
      }
      const trackId = `${userData.id}_${Date.now()}`;
      const params = {
        paytype: "nestpay",
        payMethod: "card",
        trackId,
        amount: price,
        payerId: userData.id,
        payerName: userData.name,
        payerEmail: userData.username,
        payerTel: userData.phone,
        returnUrl: `${window.location.origin}/mypage/subscription/success`,
        products: [{ name: "연간 구독권", qty: 1, price: 49800 }],
      };

      const result = await requester.requestPaymentApproval(params);

      const jsUrl = process.env.NEXT_PUBLIC_STATIC;
      const loadScript = () =>
        new Promise<void>((resolve) => {
          const script = document.createElement("script");
          script.src = jsUrl + "?ver=" + new Date().getTime();
          script.onload = () => resolve();
          document.head.appendChild(script);
        });

      if (!window.NESTPAY) await loadScript();
      if (typeof window !== "undefined" && window.NESTPAY) {
        window.NESTPAY.welcome();
        window.NESTPAY.pay({
          payMethod: "card",
          trxId: result?.link?.trxId,
          openType: "layer",
          onApprove: async (response: any) => {
            if (response.resultCd === "0000") {
              try {
                const approveResult = await requester.approvePayment({
                  trxId: result?.content?.trxId || result?.link?.trxId,
                  resultCd: response.resultCd,
                  resultMsg: response.resultMsg,
                  customerData: JSON.stringify(userData),
                });

                if (approveResult?.approveResult?.result?.resultCd === "0000") {
                  const payMeta = approveResult?.approveResult?.pay;
                  const { content } = await requester.getSubscribe({
                    store_id: storeId,
                  });
                  const plan = content?.[0];
                  const endDate = new Date(
                    Date.now() +
                      Number(plan?.metadata?.periodDays ?? 365) * 86400000
                  );
                  setShowLoadingComp(true);
                  await requester.createSubscribe({
                    store_id: storeId,
                    name: plan?.name,
                    ends_at: endDate.toISOString(),
                    payment: payMeta,
                  });
                  navigate("/mypage/subscription/success", {
                    type: "replace",
                  });
                } else {
                  toast({
                    message:
                      approveResult?.approveResult?.result?.resultMsg ||
                      "결제 승인 중 오류가 발생했습니다.",
                  });
                }
              } catch (err) {
                console.error(err);
                toast({ message: "결제 승인 중 오류가 발생했습니다." });
              } finally {
                // NESTPAY가 overflow:hidden을 남겼을 가능성 있으므로 복원
                document.body.style.overflow = "";
                document.documentElement.style.overflow = "";
              }
            } else if (response.resultCd !== "CB49") {
              toast({
                message: response.resultMsg || "결제 중 오류가 발생했습니다.",
              });
            }
          },
        });
      }
    } catch (err) {
      console.error(err);
      toast({ message: "결제 요청 중 오류가 발생했습니다." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <VerticalFlex className={styles.agree_box}>
        <FlexChild gap={10} justifyContent="center">
          <FlexChild
            className={styles.agree_link}
            width={"auto"}
            onClick={() => showModal("term_check")}
          >
            <P>이용약관</P>
          </FlexChild>

          <FlexChild
            className={styles.agree_link}
            width={"auto"}
            onClick={() => showModal("privacy_check")}
          >
            <P>개인정보처리 방침</P>
          </FlexChild>
        </FlexChild>

        <label>
          <CheckboxGroup
            name={"agree_checkbox"}
            values={isAgree}
            onChange={setIsAgree}
            className={styles.check_box}
          >
            <CheckboxChild id={"agree_check"} />

            <P>상기된 이용약관 내용에 동의합니다.</P>
          </CheckboxGroup>
        </label>
      </VerticalFlex>

      <FlexChild className={styles.confirm_btn}>
        {/* handlePaymentSubmit */}
        <Button onClick={handlePaymentSubmit}>연간 회원권 가입하기</Button>
      </FlexChild>

      {ShowLoadingComp && <LoadingPageChange />}
    </>
  );
}