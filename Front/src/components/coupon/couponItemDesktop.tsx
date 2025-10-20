"use client";
import Button from "@/components/buttons/Button";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import { useBrowserEvent } from "@/providers/BrowserEventProvider/BrowserEventProviderClient";
import NiceModal from "@ebay/nice-modal-react";
import clsx from "clsx";
import styles from "./couponItemDesktop.module.css";

export function CouponItemDesktop({ coupon }: { coupon: CouponData }) {
  const { isMobile } = useBrowserEvent();
  const isExpired = coupon.ends_at
    ? new Date(coupon.ends_at as any).getTime() < Date.now()
    : false;
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

  console.log(coupon);

  const products = coupon?.products;
  const categories = coupon?.categories;

  const isAllProductsApplied =
    (coupon?.products?.length ?? 0) === 0 &&
    (coupon?.categories?.length ?? 0) === 0;

  return (
    <tr
      className={clsx(styles.item, {
        [styles.expired]: isExpired || isUsed,
      })}
    >
      <td>
        <VerticalFlex gap={5} width={"auto"} justifyContent="center">
          <P>{typeCheck()}</P>
          <Image
            src={`/resources/icons/mypage/coupon_${coupon?.type}_icon.png`}
            width={30}
          />
        </VerticalFlex>
      </td>
      <td>
        <P>{calcCheck()}</P>
      </td>
      <td>
        <P>{coupon?.name}</P>
      </td>
      <td className={styles.txt2}>
        <P>{minCheck()}</P>
        {coupon?.type === "item" &&
          !isUsed &&
          !isExpired &&
          (!isAllProductsApplied ? (
            <Button
              onClick={() =>
                NiceModal.show("couponProductsModal", { products, categories })
              }
              className={styles.more_btn}
            >
              {products?.length !== 0
                ? "적용 상품"
                : categories?.length !== 0
                ? "적용 카테고리"
                : "적용"}
            </Button>
          ) : (
            <P>전체 적용</P>
          ))}
      </td>
      
      <td>
        <P size={14}>{new Date(coupon?.appears_at || 0).toLocaleDateString()}</P>
      </td>

      <td className={styles.txt2}>
        <P>
          {new Date(coupon?.starts_at || 0).toLocaleDateString()}부터 <br />
          {new Date(coupon?.ends_at || 0).toLocaleDateString()}까지
        </P>
        {isUsed ? (
          <P className={styles.expired_txt}>사용 만료</P>
        ) : isExpired ? (
          <P className={styles.expired_txt}>기간 만료</P>
        ) : (
          <></>
        )}
      </td>
    </tr>
  );
}

export default CouponItemDesktop;
