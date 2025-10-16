"use client";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import { useAuth } from "@/providers/AuthPorivder/AuthPorivderClient";
import { useBrowserEvent } from "@/providers/BrowserEventProvider/BrowserEventProviderClient";
import useNavigate from "@/shared/hooks/useNavigate";
import { requester } from "@/shared/Requester";
import styles from "./couponItemMobile.module.css";
import { useEffect } from "react";
import Div from "@/components/div/Div";
import clsx from "clsx";



// orderCouponListModal에는 이 컴포넌트 말고 그 안에서 코딩됨.
// 이유는 체크박스 등 쿠폰 체크한 값을 넘겨야 하는데 컴포넌트에서 또 처리하기 복잡해서 추후에 통합하던지
// 주석 써서 헷갈리지 않게 처리할 예정.

export function CouponItemMobile({
  coupon,
  selected
}: {
  coupon: CouponData;
  selected?: string[];
}) {
  const { isMobile } = useBrowserEvent();
  const isExpired =
    new Date(coupon.ends_at || 0).getTime() < new Date().getTime();
  const isUsed = coupon.used;

  const calcCheck = () => {
    if (coupon?.calc === "percent") {
      return `${coupon?.value}%`;
    } else if (coupon?.calc === "fix") {
      return `${(coupon?.value || 0).toLocaleString()}원`;
    }
  };

  const typeCheck = () => {
    if (coupon?.type === "order") {
      return "주문 할인";
    } else if (coupon?.type === "item") {
      return "상품 할인";
    } else if (coupon?.type === "shipping") {
      return "배송 할인";
    }
  };

  const minCheck = () => {
    if (coupon?.min === 0) {
      return "최소 금액 제한 없음";
    } else {
      return `${(coupon?.min || 0).toLocaleString()}원부터`;
    }
  };

  return (
    <FlexChild
      className={clsx(styles.item, {
        [styles.expired]: isExpired,
        [styles.used]: isUsed,
      })}
    >
      <HorizontalFlex>
        <VerticalFlex
          gap={10}
          padding={"20px 0 20px 15px"}
          alignItems="flex-start"
        >
          <P
            className={clsx(styles.name, {
              [styles.expired]: isExpired,
              [styles.used]: isUsed,
            })}
          >
            {coupon?.name}
          </P>

          <P>
            {calcCheck()}
          </P>

          <P>
            {minCheck()}
          </P>

          <P
            className={clsx(
              styles.date,
              isExpired && styles.expired,
              isUsed && styles.used
            )}
          >
            {new Date(coupon?.starts_at || 0).toLocaleDateString()}부터 <br />
            {new Date(coupon?.ends_at || 0).toLocaleDateString()}까지
          </P>
        </VerticalFlex>

        <FlexChild className={styles.cutout_wrap}>
          <Div className={styles.cutout_left} />
          <Div className={styles.cutout_right} />
          <Div className={styles.dashed_line} />
          <Div className={styles.spacer} />
        </FlexChild>

        <FlexChild className={styles.icon_wrap} width={"fit-content"}>
          {typeCheck()}
          {isUsed ? (
            <P className={styles.txt}>
              사용
              <br />
              완료
            </P>
          ) : isExpired ? (
            <P className={styles.txt}>
              기간
              <br />
              만료
            </P>
          ) : (
            <Image
              src="/resources/icons/mypage/coupon_pink_icon.png"
              width={30}
              alt="쿠폰 아이콘"
            />
          )}
        </FlexChild>
      </HorizontalFlex>
    </FlexChild>
  );
}

export default CouponItemMobile;
