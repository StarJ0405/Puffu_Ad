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
// lineClamp 구별해주기, TestProdcutCard는 임시로 만든거임. 나중에 프로덕트카드에 스타일만 입히면 됨.
// 라인클램프는 제목태그에 달아서 속성 주기.

export function ProductCard({
  product,
  lineClamp,
  width,
  autoPlay,
  commingSoon,
  mutate,
  onClick,
}: {
  product: ProductData;
  lineClamp?: number;
  commingSoon?: boolean;
  width?: number | string;
  autoPlay?: number;
  mutate?: () => void;
  onClick?: () => void;
}) {
  const { userData } = useAuth();

  const { isMobile } = useBrowserEvent();

  const product_link = `/products/${product.id}`;

  const navigate = useNavigate();

  return (
    <VerticalFlex
      width={width ?? isMobile ? "auto" : 200}
      // margin={product.margin}
      className={styles.prodcut_item}
    >
      <FlexChild
        className={styles.imgBox}
        height={width ?? isMobile ? "auto" : 200}
      >
        {/* {
            // 프로덕트 페이지가 best일때만 나타나기. 제품 인기순 표시임
            specialType === "best" && (
              <FlexChild
                className={clsx(
                  styles.rank,
                  product.rank < 3 ? styles.topRank : ""
                )}
              >
                <Span className="SacheonFont">{product.rank + 1}</Span>
              </FlexChild>
            )
          } */}
        <FlexChild onClick={() => (onClick ? onClick() : navigate(product_link))}>
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
  
          {commingSoon && ( // 입고예정일때만 나오기
            <Image
              className={styles.specialTypeImg}
              src={"/resources/images/commingSoon_img.png"}
              width={"101%"}
              height={"auto"}
            />
          )}
        </FlexChild>

        {mutate && isMobile && (
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
              src={`/resources/icons/main/mob_heart${
                product.wish ? "_active" : ""
              }.png`}
              width={20}
            />
            <Span>{product.wishes ?? 0}</Span>
          </FlexChild>
        )}
      </FlexChild>

      <FlexChild padding={"0 5px"} className={styles.text_box}>
        <VerticalFlex gap={2} alignItems={"start"}>
          {
            product?.brand?.name && (
              <FlexChild className={styles.store_name}>
                <Span>{product?.brand?.name}</Span>
              </FlexChild>
            )
          }

          <FlexChild
            className={styles.product_title}
            onClick={() => (onClick ? onClick() : navigate(product_link))}
            minHeight={!isMobile ? 40 : 30}
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

          <HorizontalFlex className={styles.content_item}>
            {/* <Span
                     color="var(--main-color)"
                     weight={600}
                     fontSize={14}
                     hidden={product.discount_rate >= 1}
                     paddingRight={"0.5em"}
                  >
                     {product.discount_rate}%
                  </Span> */}
            <FlexChild className={styles.price_box} minHeight={!isMobile ? 36 : 33}>
              {
                product.discount_rate > 0 && ( // 원가랑 할인가 차이 없으면 표시 안하기
                  <Span className={styles.through_price}>{product.price}</Span>
                )
              }
              <Span className={styles.discount_price}>
                {Number(product.discount_price).toLocaleString("ko-KR")}{" "}₩
              </Span>
            </FlexChild>

            {mutate && (
              <FlexChild
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  if (product.wish) {
                    requester.deleteWishList(
                      product.wish.id, { soft: false, }, () => {
                        mutate?.();
                      }
                    );
                  } else {
                    requester.createWishList( { product_id: product.id,}, () => {
                        mutate?.();
                      }
                    );
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
                <Span>{product.wishes ?? 0}</Span>
              </FlexChild>
            )}
            {/* <Span fontSize={14} weight={600}>
                     {currency_unit}
                  </Span> */}
          </HorizontalFlex>
        </VerticalFlex>
      </FlexChild>
    </VerticalFlex>
  );
}

export default ProductCard;
