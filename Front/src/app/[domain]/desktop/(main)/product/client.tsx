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
import StarRate from "@/components/star/StarRate";
import { useAuth } from "@/providers/AuthPorivder/AuthPorivderClient";
import useData from "@/shared/hooks/data/useData";
import useNavigate from "@/shared/hooks/useNavigate";
import { requester } from "@/shared/Requester";
import NiceModal from "@ebay/nice-modal-react";
import clsx from "clsx";
import { useParams } from "next/navigation";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import style from "./page.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";




export function MainCategory() { // 카테고리메뉴

   const pathname = usePathname();
   

   const ca_test = [
      {name: '코스튬/속옷', thumbnail: '/resources/images/category/ca_costum.png', width: 40,},
      {name: '진동기', thumbnail: '/resources/images/category/ca_suction.png', width: 54,},
      {name: '흡입기', thumbnail: '/resources/images/category/ca_vibrator.png', width: 54,},
   ]

   return (
      <nav className={style.category_wrap}>
         {
            pathname !== "/" ?
            <VerticalFlex className={clsx(style.ca_item, style.ca_all)}>
               <Span>ALL</Span>
            </VerticalFlex>
            : null
         }
         {
            ca_test.map((cat, i)=> (
               <VerticalFlex className={style.ca_item} key={i}>
                  <Image 
                     src={cat.thumbnail}
                     width={cat.width}
                  />
                  <Span>{cat.name}</Span>
               </VerticalFlex>
            ))
         }
      </nav>
   )
}



export function ProductCategory() { // 카테고리메뉴
   

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
         <ul className={style.category_list}>
            <li className={style.active}>
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


export function HotDealCategory() {


   const hotdeals = [
      {thumbnail: '/resources/images/dummy_img/hotdeal_banner_01.png', filter: 'daySale'},
      {thumbnail: '/resources/images/dummy_img/hotdeal_banner_02.png', filter: 'weekSale'},
      {thumbnail: '/resources/images/dummy_img/hotdeal_banner_03.png', filter: 'setSale'},
      {thumbnail: '/resources/images/dummy_img/hotdeal_banner_04.png', filter: 'pointSale'},
      {thumbnail: '/resources/images/dummy_img/hotdeal_banner_05.png', filter: 'specialSale'},
      {thumbnail: '/resources/images/dummy_img/hotdeal_banner_06.png', filter: 'refuerSale'},
   ]

   return (
      <HorizontalFlex>
         {
            hotdeals.map((cat, i)=> (
               <FlexChild cursor="pointer" key={i}>
                  <Image 
                     src={cat.thumbnail}
                     width={216}
                  />
               </FlexChild>
            ))
         }
      </HorizontalFlex>
   )
}