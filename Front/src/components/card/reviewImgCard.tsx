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
import { useBrowserEvent } from "@/providers/BrowserEventProvider/BrowserEventProviderClient";
import { useAuth } from "@/providers/AuthPorivder/AuthPorivderClient";
import useNavigate from "@/shared/hooks/useNavigate";
import StarRate from "@/components/star/StarRate";

type ReviewEntity = {
  id: string;
  images?: string[];
  avg?: number;
  count: number;
  recommend_count: number;
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
  type,
  borderRadius = 0,
  slide = false,
  onClick,
}: {
  review: ReviewEntity;
  lineClamp?: number;
  width?: number | string;
  height?: number | string;
  type?: string;
  borderRadius?: number;
  onClick?: (review: ReviewEntity) => void;

  slide?: boolean;
}) {
  const {userData}=useAuth()
  const typeValue = type ?? "normal";
  const navigate = useNavigate();

  const thumbnail = review.images?.[0] ?? "/resources/images/no_img.png";
  const date = (review.created_at ?? "").slice(0, 10);
  const name = review.user?.name ?? "익명";
  const avg = review.avg;
  const openDetail = () => {
    if(!userData?.adult) return;
    if (onClick) return onClick(review);
    NiceModal.show("photoReviewDetailModal", { review });
  };

  // 제품 정보
  // const productThumb =
  //   review.item?.variant?.product?.thumbnail ?? "/resources/images/no_img.png";
  // const productTitle = review.item?.variant?.product?.title ?? "";
  // const count = review.count;
  // const recommendCount = review?.recommend_count;

  // const productLink = () => {
  //   navigate(`/products/${review.item?.variant?.product?.id}`);
  // }

  const { isMobile } = useBrowserEvent();

  return (
    <FlexChild
      width={width ?? "100%"}
      maxWidth={!isMobile ? 295 : ""}
      onClick={openDetail}
      className={clsx(
        styles.review_item,
        typeValue !== "normal" && styles.slide_item,
        isMobile && styles.mob_review_item
      )}
      backgroundImage={
        `url(${userData?.adult ? thumbnail : "/resources/images/19_only.png"})`
      }
      // borderRadius={borderRadius}
      
    >

      <FlexChild className={styles.text_box} alignItems="end">
        <VerticalFlex alignItems={"start"} gap={15}>
          <VerticalFlex alignItems="start" gap={10}>
            <FlexChild>
              <StarRate fillColor={'#fff'} width={95} starWidth={20} starHeight={20} score={avg!} readOnly />
            </FlexChild>
            <FlexChild className={styles.content} alignItems="start" onClick={openDetail}>
              <P
                // lineClamp={lineClamp ?? 2}
                lineClamp={1}
                overflow="hidden"
                display="--webkit-box"
              >
                {review.content ?? ""}
              </P>
            </FlexChild>
          </VerticalFlex>

          {!slide && (
            <HorizontalFlex className={styles.user_dt}>
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

      {/* <HorizontalFlex className={styles.prodcut_data}> 제품 정보
        <FlexChild className={styles.img} onClick={productLink}>
          <Image
            src={userData?.adult ? productThumb : "/resources/images/19_only.png"}
            width={typeValue == "normal" ? 35 : 45}
          />
        </FlexChild>
        <VerticalFlex className={styles.info}>
          <FlexChild className={styles.title} onClick={productLink}>
            <P lineClamp={1} overflow="hidden" display="--webkit-box">
              {productTitle}
            </P>
          </FlexChild>
          <FlexChild className={styles.info_rating}>
            <HorizontalFlex>
              <FlexChild justifyContent="flex-start" flexGrow={"unset"} width={"auto"}>
                <VerticalFlex>
                  <P>
                    평가 <Span>{avg}</Span>
                  </P>
                  <P>
                    리뷰 <Span>{count}</Span>
                  </P>
                </VerticalFlex>
              </FlexChild>
              <P hidden> 추천수 <Span>{recommendCount}</Span></P>
            </HorizontalFlex>
          </FlexChild>
        </VerticalFlex>
      </HorizontalFlex> */}
    </FlexChild>
  );
}
