"use client";
import CouponItemMobile from "@/components/coupon/couponItemMobile";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import { useAuth } from "@/providers/AuthPorivder/AuthPorivderClient";
import usePageData from "@/shared/hooks/data/usePageData";
import { requester } from "@/shared/Requester";
import { useMemo, useState, useRef, useEffect } from "react";
import styles from "./page.module.css";
import clsx from "clsx";
import Image from "@/components/Image/Image";
import CheckboxGroup from "@/components/choice/checkbox/CheckboxGroup";
import CheckboxChild from "@/components/choice/checkbox/CheckboxChild";
import Button from "@/components/buttons/Button";
import { toast } from "@/shared/utils/Functions";
import NiceModal from "@ebay/nice-modal-react";
import useNavigate from "@/shared/hooks/useNavigate";

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


export function CheckConfirm () {

  const [isAgree, setIsAgree] = useState<string[]>([]);
  const navigate = useNavigate();

  const showModal = (type: "term_check" | "privacy_check") => {
    NiceModal.show("AgreeContent", {type});
  };



  // 결제 버튼
  const handlePaymentSubmit = async () => {
    if (isAgree.length === 0) {
      toast({ message: "서비스 이용약관에 동의해주세요." });
      return;
    }

    navigate('/mypage/subscription/success')
  }

  return (
    <>
      <VerticalFlex className={styles.agree_box}>
        <FlexChild gap={10} justifyContent="center">
          <FlexChild className={styles.agree_link} width={'auto'} onClick={() => showModal("term_check")}>
            <P>이용약관</P>
          </FlexChild>
  
          <FlexChild className={styles.agree_link} width={'auto'} onClick={() => showModal("privacy_check")}>
            <P>개인정보처리 방침</P>
          </FlexChild>
        </FlexChild>
  
        <label>
          <CheckboxGroup name={'agree_checkbox'} values={isAgree} onChange={setIsAgree} className={styles.check_box}>
            <CheckboxChild id={'agree_check'} />
  
            <P>상기된 이용약관 내용에 동의합니다.</P>
          </CheckboxGroup>
        </label>
      </VerticalFlex>

      <FlexChild className={styles.confirm_btn}>
        <FlexChild className={styles.border_layer} onClick={handlePaymentSubmit}>
          <Button>
            연간 회원권 결제하기
          </Button>
        </FlexChild>
      </FlexChild>
    </>
  )
}


