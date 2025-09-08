"use client"
import Button from "@/components/buttons/Button";
import Div from "@/components/div/Div";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Icon from "@/components/icons/Icon";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import Select from "@/components/select/Select";
import Span from "@/components/span/Span";
import MasonryGrid from "@/components/masonry/MasonryGrid";
import StarRate from "@/components/star/StarRate";
import { useAuth } from "@/providers/AuthPorivder/AuthPorivderClient";
import useData from "@/shared/hooks/data/useData";
import useNavigate from "@/shared/hooks/useNavigate";
import { requester } from "@/shared/Requester";
import NiceModal from "@ebay/nice-modal-react";
import clsx from "clsx";
import { useParams } from "next/navigation";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import ProductCard from "@/components/card/ProductCard";
import { usePathname } from "next/navigation";
import styles from "./reviewImgCard.module.css";


type ReviewItem = {
  thumbnail: string;
  content: string;
  name: string;
  date: string;
  product: {
    thumb: string;
    title: string;
    rating: string;
    reviewcount: string;
  };
};

// lineClamp 구별해주기, TestProdcutCard는 임시로 만든거임. 나중에 프로덕트카드에 스타일만 입히면 됨.
// 라인클램프는 제목태그에 달아서 속성 주기.

export function ReviewImgCard(
   { review, lineClamp, width, autoPlay }:
   { 
      review: ReviewItem;
      lineClamp?: number; 
      width?: number;
      autoPlay? : number;
   }) 
{

   return (
      <VerticalFlex
         width={width ?? 244}
         // margin={review.margin}
         className={styles.review_item}
      >
         <FlexChild className={styles.imgBox}>
            <Image src={review.thumbnail} width={"100%"} height={"auto"}/>
         </FlexChild>

         <FlexChild padding={"0 5px"} className={styles.text_box}>
            <VerticalFlex alignItems={'start'}>

               <FlexChild className={styles.content}>
                  <P lineClamp={2} overflow="hidden" display="--webkit-box">{review.content}</P>
               </FlexChild>

               <HorizontalFlex className={styles.title_box}>
                  <FlexChild className={styles.date}>
                     <Span>{review.date}</Span>
                  </FlexChild>

                  <FlexChild className={styles.name}>
                     <Span>{review.name}</Span>
                  </FlexChild>
               </HorizontalFlex>
            </VerticalFlex>
         </FlexChild>

         <HorizontalFlex className={styles.prodcut_data}>
            <FlexChild className={styles.img}>
               <Image src={review.product.thumb} width={32} />
            </FlexChild>

            <VerticalFlex className={styles.info}>
               <FlexChild className={styles.title}>
                  <P 
                     lineClamp={1}
                     overflow="hiddent"
                     whiteSpace="nowrap"
                     display="--webkit-box"
                  >
                     {review.product.title}
                  </P>
               </FlexChild>
               <FlexChild className={styles.info_rating}>
                  <P>평가 <Span>{review.product.rating}</Span></P>
                  <P>리뷰 <Span>{review.product.reviewcount}</Span></P>
               </FlexChild>
            </VerticalFlex>
         </HorizontalFlex>
      </VerticalFlex>
   )
}

export default ReviewImgCard