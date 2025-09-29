"use client";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import clsx from "clsx";
import { useState } from "react";
import styles from "./reviewImgCard.module.css";
import NiceModal from "@ebay/nice-modal-react";
import { maskTwoThirds } from "@/shared/utils/Functions";

type ReviewEntity = {
  id: string;
  images?: string[];
  avg?: number;
  count: number;
  content?: string;
  created_at?: string;
  star_rate?: number;
  user?: { id?: string; name?: string };
  item?: {
    variant?: { product?: { id?: string; title?: string; thumbnail?: string } };
  };
};
// lineClamp 구별해주기, TestProdcutCard는 임시로 만든거임. 나중에 프로덕트카드에 스타일만 입히면 됨.
// 라인클램프는 제목태그에 달아서 속성 주기.

export default function ReviewImgCard({
  review,
  lineClamp,
  width,
  height,
  board,
  slide = false,
  onClick,
}: {
  review: ReviewEntity;
  lineClamp?: number;
  width?: number | string;
  height?: number | string;
  onClick?: (review: ReviewEntity) => void;
  board?: string;
  slide?: boolean;
}) {
  const boardValue = board ?? "normal";
  const [adultOk] = useState(true);

  const thumbnail = review.images?.[0] ?? "/resources/images/no_img.png";
  const date = (review.created_at ?? "").slice(0, 10);
  const name = review.user?.name ?? "익명";
  const productThumb =
    review.item?.variant?.product?.thumbnail ?? "/resources/images/no_img.png";
  const productTitle = review.item?.variant?.product?.title ?? "";
  const count = review.count;
  const avg = review.avg;
  const openDetail = () => {
    if (onClick) return onClick(review);
    NiceModal.show("photoReviewDetailModal", { review });
  };

  return (
    <VerticalFlex
      width={width ?? 244}
      className={clsx(
        styles.review_item,
        boardValue !== "normal" && styles.slide_item
      )}
      onClick={openDetail}
    >
      <FlexChild
        className={styles.imgBox}
        onClick={openDetail}
        minWidth={142}
        minHeight={142}
        maxWidth={244}
        maxHeight={244}
      >
        <Image
          src={adultOk ? thumbnail : "/resources/images/19_only.png"}
          width={"100%"}
          height={height}
        />
      </FlexChild>

      <FlexChild padding={"0 5px"} className={styles.text_box}>
        <VerticalFlex alignItems={"start"}>
          <FlexChild className={styles.content}>
            <P
              lineClamp={lineClamp ?? 2}
              overflow="hidden"
              display="--webkit-box"
            >
              {review.content ?? ""}
            </P>
          </FlexChild>

          {!slide && (
            <HorizontalFlex className={styles.title_box}>
              <FlexChild className={styles.date}>
                <Span>{date}</Span>
              </FlexChild>
              <FlexChild className={styles.name}>
                <Span>{maskTwoThirds(name)}</Span>
              </FlexChild>
            </HorizontalFlex>
          )}
        </VerticalFlex>
      </FlexChild>

      <HorizontalFlex className={styles.prodcut_data}>
        <FlexChild className={styles.img}>
          <Image
            src={adultOk ? productThumb : "/resources/images/19_only.png"}
            width={boardValue == "normal" ? 35 : 45}
          />
        </FlexChild>
        <VerticalFlex className={styles.info}>
          <FlexChild className={styles.title}>
            <P lineClamp={1} overflow="hidden" display="--webkit-box">
              {productTitle}
            </P>
          </FlexChild>
          <FlexChild className={styles.info_rating}>
            <P>
              평가 <Span>{avg}</Span>
            </P>
            <P>
              리뷰 <Span>{count}</Span>
            </P>
          </FlexChild>
        </VerticalFlex>
      </HorizontalFlex>
    </VerticalFlex>
  );
}
