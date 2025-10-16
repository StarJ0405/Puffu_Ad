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
import styles from "./couponItem.module.css";
import { useEffect } from "react";
import Div from "@/components/div/Div";
import clsx from "clsx";

export function CouponItem({
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
            {coupon.name}
          </P>
          <P
            className={clsx(
              styles.date,
              isExpired && styles.expired,
              isUsed && styles.used
            )}
          >
            사용기간 {new Date(coupon?.ends_at || 0).toLocaleDateString()} 까지
          </P>
        </VerticalFlex>

        <FlexChild className={styles.cutout_wrap}>
          <Div className={styles.cutout_left} />
          <Div className={styles.cutout_right} />
          <Div className={styles.dashed_line} />
          <Div className={styles.spacer} />
        </FlexChild>

        <FlexChild className={styles.icon_wrap} width={"fit-content"}>
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

export default CouponItem;
