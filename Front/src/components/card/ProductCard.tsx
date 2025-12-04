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
import styles from "./ProductCard.module.css";
import { useEffect } from "react";
import clsx from "clsx";
import Div from "@/components/div/Div";
// lineClamp 구별해주기, TestProdcutCard는 임시로 만든거임. 나중에 프로덕트카드에 스타일만 입히면 됨.
// 라인클램프는 제목태그에 달아서 속성 주기.

export function ProductCard({
  product,
  lineClamp,
  width,
  autoPlay,
  mutate,
  onClick,
}: {
  product: ProductData;
  lineClamp?: number;
  width?: number | string;
  autoPlay?: number;
  mutate?: () => void;
  onClick?: () => void;
}) {
  const { userData } = useAuth();
  const { isMobile } = useBrowserEvent();
  const product_link = `/products/${product.id}`;
  const navigate = useNavigate();
  const minHeightCheck = lineClamp === 1;
  const isComingSoon = Boolean((product as any)?.warehousing);
  // variants 처리
  const variants = Array.isArray((product as any)?.variants)
    ? (product as any).variants
    : [];
  // product 자체 buyable
  const productBuyable = Boolean((product as any)?.buyable);
  // variant 전부 buyable=false일 때만 true
  const allVariantsUnbuyable =
    variants.length > 0 && variants.every((v: any) => !v?.buyable);
  // 최종 구매 가능 여부
  const isBuyable = productBuyable && !allVariantsUnbuyable;
  // 전부 재고 0 이하일 때 품절
  const isOutOfStock =
    variants.length > 0
      ? variants.every((v: any) => Number(v?.stack ?? 0) <= 0)
      : Number((product as any)?.variant?.stack ?? 0) <= 0;
  // 오버레이 분기
  let overlay: "coming" | "unbuyable" | "outofstock" | null = null;
  if (isComingSoon) overlay = "coming";
  else if (!isBuyable) overlay = "unbuyable";
  else if (isOutOfStock) overlay = "outofstock";

  // console.log(product);

  return (
    <VerticalFlex
      width={width ?? (!isMobile ? 200 : 'auto')}
      // margin={product.margin}
      className={clsx(
        styles.prodcut_item,
        isMobile ? styles.mob_prodcut_item : ""
      )}
    >
      <FlexChild
        className={styles.imgBox}
        height={width ?? (!isMobile ? 305 : 'auto')}
      >
        <FlexChild
          className={styles.thumbnail}
          width={'100%'}
          height={'100%'}
          onClick={() => (onClick ? onClick() : navigate(product_link))}
        >
          {userData?.adult ? (
            <Image src={product.thumbnail} width={"100%"} height={"auto"} />
          ) : (
            // 성인인증 안될때 나오는 이미지
            <Image
              src={"/resources/images/19_only.png"}
              width={"100%"}
              height={"auto"}
            />
          )}
          {
            overlay && (
              <StockStatusMessage overlay={overlay} />
            )
          }
        </FlexChild>

        <FlexChild
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            if (product.wish) {
              requester.deleteWishList(product.wish.id, { soft: false }, () =>
                mutate?.()
              );
            } else {
              requester.createWishList({ product_id: product.id }, () =>
                mutate?.()
              );
            }
          }}
          className={styles.heart_counter}
        >
          <Image
            src={`/resources/icons/main/product_heart_icon${
              product.wish ? "_active" : ""
            }.png`}
            width={24}
          />
        </FlexChild>
      </FlexChild>

      <FlexChild className={styles.text_box}>
        <VerticalFlex gap={2} alignItems={"start"}>
          {/* {product?.brand?.name && (
            <FlexChild className={styles.store_name}>
              <Span>{product?.brand?.name}</Span>
            </FlexChild>
          )} */}

          <FlexChild
            className={styles.product_title}
            onClick={() => (onClick ? onClick() : navigate(product_link))}
            minHeight={!isMobile ? 38 : 32}
            // minHeight={
            //   !isMobile ? (minHeightCheck ? 20 : 40) : minHeightCheck ? 16 : 30
            // }
            alignItems="flex-start"
          >
            <P
              textOverflow={"ellipsis"}
              display={"webkit-box"}
              overflow={"hidden"}
              lineClamp={lineClamp}
            >
              {product.title}
            </P>
          </FlexChild>

          <VerticalFlex className={styles.content_item} alignItems="start">
            
            <FlexChild className={styles.user_state_box} gap={10} justifyContent="start" width={'auto'}>
              <FlexChild className={styles.heart_dt} gap={5} justifyContent="start" width={'auto'}>
                <Image
                  src={`/resources/icons/main/product_heart_state.png`}
                  width={15}
                />
                <Span>{product.wishes || product.wishlists?.length || 0}</Span>
              </FlexChild>

              <FlexChild className={styles.review_dt} gap={5} justifyContent="start" width={'auto'}>
                <FlexChild width={'auto'} gap={3} className={styles.star}>
                  <Image
                    src={`/resources/icons/main/product_review_star.png`}
                    width={15}
                  />
                  <Span>평점</Span>
                </FlexChild>
                <FlexChild className={styles.review}>
                  {/* 평점, (리뷰 수) */}
                  <Span>0 (0)</Span>
                </FlexChild>
              </FlexChild>

            </FlexChild>

            <FlexChild className={styles.price_box}>
              <Span className={styles.discount_price}>
                {Number(product.discount_price).toLocaleString("ko-KR")}원
              </Span>
                <Span className={styles.through_price}>
                  {
                    product.discount_rate > 0 && 
                    `${Number(product.price).toLocaleString("ko-KR")}원`
                  }
                </Span>
                {product.discount_rate > 0 && ( // 원가랑 할인가 차이 없으면 표시 안하기
                  <Span className={styles.discount_rate}>{product.discount_rate}%</Span>
                )}
            </FlexChild>

            {/* {!isMobile && mutate && (
              <FlexChild
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  if (userData) {
                    if (product.wish) {
                      requester.deleteWishList(
                        product.wish.id,
                        { soft: false },
                        () => {
                          mutate?.();
                        }
                      );
                    } else {
                      requester.createWishList(
                        { product_id: product.id },
                        () => {
                          mutate?.();
                        }
                      );
                    }
                  }
                }}
                className={styles.heart_counter}
              >
                <Image
                  src={`/resources/icons/main/product_heart_icon${
                    product.wish ? "_active" : ""
                  }.png`}
                  width={23}
                />
                <Span>{product.wishes || product.wishlists?.length || 0}</Span>
              </FlexChild>
            )} */}
            {/* <Span fontSize={14} weight={600}>
                     {currency_unit}
                  </Span> */}
          </VerticalFlex>
        </VerticalFlex>
      </FlexChild>
    </VerticalFlex>
  );
}



function StockStatusMessage({overlay} : {overlay: string | null}) {
  const { isMobile } = useBrowserEvent();
  const message =
    overlay === "coming"
      ? "입고 예정입니다."
      : overlay === "unbuyable"
      ? "구매 불가입니다."
      : overlay === "outofstock"
      ? "재고 부족입니다."
      : null;

  return (
    <FlexChild className={styles.StatusBox} justifyContent="center">
      <P fontSize={!isMobile ? 18 : 15}>{message}</P>
    </FlexChild>
  )
}

export default ProductCard;
