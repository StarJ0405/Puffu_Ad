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
import style from "./ProductCard.module.css";
import Link from "next/link";
import { useBrowserEvent } from "@/providers/BrowserEventProvider/BrowserEventProviderClient";



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
}

// lineClamp 구별해주기, TestProdcutCard는 임시로 만든거임. 나중에 프로덕트카드에 스타일만 입히면 됨.
// 라인클램프는 제목태그에 달아서 속성 주기.

export function TestProductCard(
   { product, lineClamp, width, autoPlay, commingSoon, specialType }:
   { 
      product: ListItem;
      lineClamp?: number; 
      commingSoon? : boolean;
      width?: number | string;
      autoPlay? : number;
      specialType? : string;
   }) 
{
   const { isMobile } = useBrowserEvent();

   const product_link = `/products/${product.id}`;


   // 프로덕트 카드 쓰면 다 지워도 됨.
   const [heartCheck, setHeartCheck] = useState(false);
   const [heartCount, setHeartCount] = useState(product.heart_count);
   

   const toggleHeart = () => {
      setHeartCheck(prev => !prev);
      setHeartCount(prev => prev + (heartCheck ? -1 : 1));
   };

   const [adultCheck, setadultCheck] = useState(true);

   return (
      <VerticalFlex
         width={width ?? 200}
         // margin={product.margin}
         className={style.prodcut_item}
      >
         <FlexChild className={style.imgBox}>
            <Link href={product_link}>
             {/* 링크 상품 링크로 바꾸기 */}

               { // 프로덕트 페이지가 best일때만 나타나기. 제품 인기순 표시임.
                  specialType === 'best' && (
                     <FlexChild 
                        className={clsx(style.rank, (product.rank < 3 ? style.topRank : ''))}
                     >
                        <Span className="SacheonFont">{product.rank + 1}</Span>
                     </FlexChild>
                  )
               }
               {
                  adultCheck === true ? 
                  <Image src={product.thumbnail} width={"100%"} height={"auto"}/>
                  :
                  // 성인인증 안될때 나오는 이미지
                  <Image src={'/resources/images/19_only.png'} width={"100%"} height={"auto"}/>
               }
   
               {
                  commingSoon && ( // 입고예정일때만 나오기
                     <Image className={style.specialTypeImg} src={'/resources/images/commingSoon_img.png'} width={"101%"} height={"auto"}/>
                  )
               }
            </Link>
         </FlexChild>

         <FlexChild padding={"0 5px"} className={style.text_box}>
            <VerticalFlex gap={2} alignItems={'start'}>
               <FlexChild className={style.store_name}>
                  <Span>{product.store_name}</Span>
               </FlexChild>

               <FlexChild className={style.product_title}>
                  <Link href={product_link}>
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
               
               <HorizontalFlex className={style.content_item}>
                  {/* <Span
                     color="var(--main-color)"
                     weight={600}
                     fontSize={14}
                     hidden={product.discount_rate >= 1}
                     paddingRight={"0.5em"}
                  >
                     {product.discount_rate}
                  </Span> */}
                  <VerticalFlex className={style.price_box}>
                     <Span
                        className={style.through_price}
                        textDecoration={"line-through"}
                     >
                        {product.price}원
                     </Span>
                     <Span className={style.discount_price} >
                        {product.discount_price}원
                     </Span>
                  </VerticalFlex>

                  <FlexChild onClick={toggleHeart} className={style.heart_counter}>
                     <Image
                        src={`/resources/icons/main/product_heart_icon${heartCheck === true ? '_active' : ''}.png`}
                        width={23}
                     />
                     <Span>0</Span>
                  </FlexChild>
                  {/* <Span fontSize={14} weight={600}>
                     {currency_unit}
                  </Span> */}
               </HorizontalFlex>
            </VerticalFlex>
         </FlexChild>
      </VerticalFlex>
   )
}

export default TestProductCard