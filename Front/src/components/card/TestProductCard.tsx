"use client";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import { useBrowserEvent } from "@/providers/BrowserEventProvider/BrowserEventProviderClient";
import clsx from "clsx";
import Link from "next/link";
import { useState } from "react";
import styles from "./ProductCard.module.css";

type ListItem = {
  thumbnail: string;
  title: string;
  price: number;
  discount_rate: number;
  discount_price: number;
  heart_count: number;
  store_name: string;
  rank: number;
  id: string;
  wishes?: number;
};

// lineClamp 구별해주기, TestProdcutCard는 임시로 만든거임. 나중에 프로덕트카드에 스타일만 입히면 됨.
// 라인클램프는 제목태그에 달아서 속성 주기.

export function TestProductCard({
  product,
  lineClamp,
  width,
  autoPlay,
  commingSoon,
  specialType,
}: {
  product: ListItem;
  lineClamp?: number;
  commingSoon?: boolean;
  width?: number | string;
  autoPlay?: number;
  specialType?: string;
}) {
  const { isMobile } = useBrowserEvent();

  const product_link = `/products/${product.id}`;

  // 프로덕트 카드 쓰면 다 지워도 됨.
  const [heartCheck, setHeartCheck] = useState(false);
  const [heartCount, setHeartCount] = useState(product.heart_count);

  const toggleHeart = () => {
    setHeartCheck((prev) => !prev);
    setHeartCount((prev) => prev + (heartCheck ? -1 : 1));
  };

  const [adultCheck, setadultCheck] = useState(true);

  console.log("상품222", product);

  return (
    <VerticalFlex
      width={width ?? isMobile ? "auto" : 200}
      // margin={product.margin}
      className={styles.prodcut_item}
    >
      <FlexChild className={styles.imgBox}>
        <Link
          href={product_link}
          className={styles.link_Frame}
          style={{
            pointerEvents: commingSoon ? "none" : "auto",
          }}
        >
          {
            // 프로덕트 페이지가 best일때만 나타나기. 제품 인기순 표시임.
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
          }
          {adultCheck === true ? (
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
        </Link>

        {isMobile && (
          <FlexChild onClick={toggleHeart} className={styles.heart_counter}>
            <Image
              src={`/resources/icons/main/mob_heart${
                heartCheck === true ? "_active" : ""
              }.png`}
              width={20}
            />
            <Span>{product.wishes}0</Span>
          </FlexChild>
        )}
      </FlexChild>

      <FlexChild padding={"0 5px"} className={styles.text_box}>
        <VerticalFlex gap={2} alignItems={"start"}>
          <FlexChild className={styles.store_name}>
            <Span>{product.store_name}</Span>
          </FlexChild>

          <FlexChild className={styles.product_title}>
            <Link
              href={product_link}
              style={{
                pointerEvents: commingSoon ? "none" : "auto",
              }}
            >
              <P
                textOverflow={"ellipsis"}
                display={"webkit-box"}
                overflow={"hidden"}
                lineClamp={lineClamp}
              >
                {product.title}
              </P>
            </Link>
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
            <VerticalFlex className={styles.price_box}>
              <Span className={styles.through_price}>{product.price}</Span>
              <Span className={styles.discount_price}>
                {product.discount_price}₩
              </Span>
            </VerticalFlex>

            {!isMobile && (
              <FlexChild onClick={toggleHeart} className={styles.heart_counter}>
                <Image
                  src={`/resources/icons/main/product_heart_icon${
                    heartCheck === true ? "_active" : ""
                  }.png`}
                  width={23}
                />
                <Span>{product.wishes}0</Span>
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

export default TestProductCard;
