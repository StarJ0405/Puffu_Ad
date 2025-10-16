"use client";
import Button from "@/components/buttons/Button";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import { useBrowserEvent } from "@/providers/BrowserEventProvider/BrowserEventProviderClient";
import NiceModal from "@ebay/nice-modal-react";
import clsx from "clsx";
import styles from "./couponItemMobile.module.css";



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
      return "주문";
    } else if (coupon?.type === "item") {
      return "상품";
    } else if (coupon?.type === "shipping") {
      return "배송";
    }
  };

  const minCheck = () => {
    if (coupon?.min === 0) {
      return "최소 금액 제한 없음";
    } else {
      return `${(coupon?.min || 0).toLocaleString()}원부터 사용 가능`;
    }
  };

  
  const products = coupon?.products;
  const categories = coupon?.categories;

  const isAllProductsApplied = ((coupon?.products?.length ?? 0) === 0) && ((coupon?.categories?.length ?? 0) === 0);

  return (
    <FlexChild
      className={clsx(styles.item, {
        [styles.expired]: isExpired || isUsed,
      })}
    >
      <HorizontalFlex>
        <VerticalFlex
          className={styles.data_card}
          alignItems="flex-start"
        >
          <P className={clsx(styles.name)}>
            {coupon?.name}
          </P>

          <P className={clsx('SacheonFont', styles.value)}>
            {calcCheck()}
          </P>

          <HorizontalFlex alignItems="end" gap={10}>
            <VerticalFlex alignItems="start" className={styles.txt1} gap={3}>
              <P fontSize={14}>
                {minCheck()}
              </P>
    
              <P
                className={clsx(
                  styles.date,
                  isExpired && styles.expired,
                  isUsed && styles.used
                )}
              >
                {new Date(coupon?.starts_at || 0).toLocaleDateString()}~ 
                {new Date(coupon?.ends_at || 0).toLocaleDateString()}까지
              </P>
            </VerticalFlex>
            {
              coupon?.type === "item" && !isUsed && !isExpired && (
                <FlexChild width={'auto'}>
                  {!isAllProductsApplied ? (
                    <Button onClick={()=> NiceModal.show("couponProductsModal", { products, categories })} className={clsx(styles.more_btn, styles.btn_txt)}>
                      {
                        products?.length !==0 ? (
                          '적용 상품'
                        ) : categories?.length !==0 ? (
                          '적용 분류'
                        ) : (
                          '적용'
                        )
                      }
                    </Button>
                  ) : (
                    <P className={styles.btn_txt}>전체 상품</P>
                  )}
                </FlexChild>
              )
            }
          </HorizontalFlex>
        </VerticalFlex>

        <FlexChild className={styles.cutout_wrap} width={"auto"} height={'100%'}>
          <VerticalFlex gap={10}>
            <Image
              src={`/resources/icons/mypage/coupon_${coupon?.type}_icon.png`}
              width={30}
              alt="쿠폰 아이콘"
            />
            <P fontSize={12}>{typeCheck()}</P>
          </VerticalFlex>
        </FlexChild>
      </HorizontalFlex>
      {
        (isExpired || isUsed) && (
          <FlexChild className={styles.expired_card} justifyContent="center">
            {
              isExpired ? (
                <P>사용 만료</P>
              ) : isUsed ? (
                <P>기간 만료</P>
              ) : (
                <></>
              )
            }
          </FlexChild>
        )
      }
    </FlexChild>
  );
}


// {isUsed ? (
//               <P className={styles.txt}>
//                 사용
//                 <br />
//                 완료
//               </P>
//             ) : isExpired ? (
//               <P className={styles.txt}>
//                 기간
//                 <br />
//                 만료
//               </P>
//             ) : (
//               <Image
//                 src="/resources/icons/mypage/coupon_pink_icon.png"
//                 width={30}
//                 alt="쿠폰 아이콘"
//               />
//             )}

export default CouponItemMobile;
