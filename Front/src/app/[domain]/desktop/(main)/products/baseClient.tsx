"use client"
import Button from "@/components/buttons/Button";
import Div from "@/components/div/Div";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import MasonryGrid from "@/components/masonry/MasonryGrid";
import TestProductCard from "@/components/card/TestProductCard";
import Icon from "@/components/icons/Icon";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import Select from "@/components/select/Select";
import Span from "@/components/span/Span";
import NoContent from "@/components/noContent/noContent";
import StarRate from "@/components/star/StarRate";
import { useAuth } from "@/providers/AuthPorivder/AuthPorivderClient";
import useData from "@/shared/hooks/data/useData";
import useNavigate from "@/shared/hooks/useNavigate";
import { requester } from "@/shared/Requester";
import NiceModal from "@ebay/nice-modal-react";
import clsx from "clsx";
import { useParams } from "next/navigation";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import Pstyles from "./products.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ListPagination from "@/components/listPagination/ListPagination";




export function ProdcutCategory() { // 대분류 카테고리

   const pathname = usePathname();
   
   // css : 카테고리 추가되어도 flex-wrap 구조 문제 없게 수정하기

   const ca_test = [
      {name: '남성토이', thumbnail: '/resources/images/category/gif_ca_Img_01.gif',},
      {name: '여성토이', thumbnail: '/resources/images/category/gif_ca_Img_02.gif',},
      {name: '윤활제/젤', thumbnail: '/resources/images/category/gif_ca_Img_03.gif',},
      {name: '콘돔', thumbnail: '/resources/images/category/gif_ca_Img_04.gif',},
      {name: '의류', thumbnail: '/resources/images/category/gif_ca_Img_05.gif',},
      {name: 'BDSM 토이', thumbnail: '/resources/images/category/gif_ca_Img_06.gif',},
      {name: 'LGBT 토이', thumbnail: '/resources/images/category/gif_ca_Img_07.gif',},
      {name: '악세서리', thumbnail: '/resources/images/category/ca_img08.png',},
   ]

   return (
      <nav className={Pstyles.category_wrap}>
         {/* ca_item에 active 클래스 주기. active 클래스만 걸리면 효과 들어감. */}
         {
            pathname !== "/" ?
            <VerticalFlex className={clsx(Pstyles.ca_item, Pstyles.ca_all)}>
               <FlexChild className={Pstyles.ca_thumb} width={120} height={120}>
                  <P>ALL</P>
               </FlexChild>
              <Span>전체</Span>
            </VerticalFlex>
            : null
         }
         {
            ca_test.map((cat, i)=> (
               <VerticalFlex className={Pstyles.ca_item} key={i}>
                  <FlexChild className={Pstyles.ca_thumb}>
                     <Image 
                        src={cat.thumbnail}
                        width={'auto'}
                        height={120}
                     />
                  </FlexChild>
                  <Span>{cat.name}</Span>
               </VerticalFlex>
            ))
         }
      </nav>
   )
}



export function SecondCategory() { // 중분류, 소분류 카테고리
   

   const ca_test = [
      {name: '세척/세정'},
      {name: '관리/파우더'},
      {name: '워머/히팅',},
      {name: '드라이/건조',},
      {name: '보관/파우치',},
      {name: '오나홀 보조',},
      {name: '기타용품',},
   ]

   return (
      <>
         <ul className={Pstyles.category_list}>
            <li className={Pstyles.active}>
               <Span>전체</Span>
            </li>
            {
               ca_test.map((cat, i)=> (
                  <li key={i}>
                     <Span>{cat.name}</Span>
                  </li>
               ))
            }
         </ul>
      </>
   )
}



// 인기순, 추천순, 최신순 필터
export function SortFilter() {

   return (
      <HorizontalFlex className={Pstyles.sort_group}>
         <FlexChild className={Pstyles.count_txt}>
            <P>
               <b>38</b>개의 상품
            </P>
         </FlexChild>

         <FlexChild width={'auto'}>
            <HorizontalFlex className={Pstyles.sort_box}>
               <Button className={Pstyles.sort_btn}>인기순</Button>
               <Button className={Pstyles.sort_btn}>추천순</Button>
               <Button className={Pstyles.sort_btn}>최신순</Button>
            </HorizontalFlex>
         </FlexChild>
      </HorizontalFlex>
   )
}





type ListItem = {
   thumbnail: string;
   title: string;
   price: number;
   discount_rate: number;
   discount_price: number;
   heart_count: number;
   store_name: string;
   rank: number;
}


const ListProduct: ListItem[] = [ // 임시
{
   thumbnail: '/resources/images/dummy_img/product_01.png',
   title: '블랙 골드버스트 바디수트',
   price: 30000,
   discount_rate: 12,
   discount_price: 20000,
   heart_count: 10,
   store_name: '키테루 키테루',
   rank: 0,
},
{
   thumbnail: '/resources/images/dummy_img/product_02.png',
   title: '핑크색 일본 st 로제 베일 가벼움',
   price: 30000,
   discount_rate: 12,
   discount_price: 20000,
   heart_count: 100,
   store_name: '키테루 키테루',
   rank: 1,
},
{
   thumbnail: '/resources/images/dummy_img/product_03.png',
   title: '뒷태 반전 유혹하는 파자마',
   price: 30000,
   discount_rate: 12,
   discount_price: 20000,
   heart_count: 100,
   store_name: '키테루 키테루',
   rank: 2,
},
{
   thumbnail: '/resources/images/dummy_img/product_04.jpg',
   title: '스지망 쿠파 로린코 처녀궁 프리미엄 소프트',
   price: 30000,
   discount_rate: 12,
   discount_price: 20000,
   heart_count: 70,
   store_name: '키테루 키테루',
   rank: 3,
},
{
   thumbnail: '/resources/images/dummy_img/product_05.png',
   title: '[유니더스/얇은콘돔형] 지브라 콘돔 1box(10p) [NR]',
   price: 30000,
   discount_rate: 12,
   discount_price: 20000,
   heart_count: 4,
   store_name: '키테루 키테루',
   rank: 4,
},
{
   thumbnail: '/resources/images/dummy_img/product_06.png',
   title: '블랙 망사 리본 스타킹',
   price: 30000,
   discount_rate: 12,
   discount_price: 20000,
   heart_count: 1020,
   store_name: '키테루 키테루',
   rank: 5,
},
{
   thumbnail: '/resources/images/dummy_img/product_07.png',
   title: '섹시 스트랩 간호사 st 코스튬',
   price: 30000,
   discount_rate: 12,
   discount_price: 20000,
   heart_count: 1030,
   store_name: '키테루 키테루',
   rank: 6,
},
]

export function BaseProductList({commingSoon} : {commingSoon? : boolean}) {

   return (
      <>    
         {ListProduct.length > 0 ? (
         <>
            <SortFilter />
            <VerticalFlex>
               <MasonryGrid gap={20} breakpoints={5}>
                  {
                     ListProduct.map((product, i) => {
                        return (
                           <TestProductCard
                              product={product}
                              lineClamp={2}
                              key={i}
                              width={244}
                              commingSoon={commingSoon}
                           />
                        )
                     })
                  }
               </MasonryGrid>
            </VerticalFlex>
         </>
         ):(
            <NoContent type={'상품'} />
         )}
         
         <ListPagination />
      </>
   )
}