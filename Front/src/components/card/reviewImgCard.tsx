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
import styles from "./ProductCard.module.css";


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
         className={styles.prodcut_item}
      >
         <FlexChild className={styles.imgBox}>
            <Image src={review.thumbnail} width={"100%"} height={"auto"}/>
         </FlexChild>

         <FlexChild padding={"0 5px"} className={styles.text_box}>
            <VerticalFlex gap={2} alignItems={'start'}>
               <FlexChild className={styles.store_name}>
                  <Span>{review.content}</Span>
               </FlexChild>

               <FlexChild className={styles.product_title}>
                  <P 
                     textOverflow={"ellipsis"}
                     display={"webkit-box"}
                     overflow={"hidden"}
                     lineClamp={lineClamp}
                  >
                     {review.name}
                  </P>
               </FlexChild>
               
               <HorizontalFlex className={styles.content_item}>
                  {/* <Span
                     color="var(--main-color)"
                     weight={600}
                     fontSize={14}
                     hidden={review.discount_rate >= 1}
                     paddingRight={"0.5em"}
                  >
                     {review.discount_rate}
                  </Span> */}
                  <VerticalFlex className={styles.price_box}>
                     <Span
                        className={styles.through_price}
                        textDecoration={"line-through"}
                     >
                        {review.date}
                     </Span>
                     <Span className={styles.discount_price} >
                        {review.product.title} ₩
                     </Span>
                  </VerticalFlex>
               </HorizontalFlex>
            </VerticalFlex>
         </FlexChild>
      </VerticalFlex>
   )
}

export default ReviewImgCard