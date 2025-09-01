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
import { usePathname } from "next/navigation";
import style from "./mainCategory.module.css";

export function MainCatgeory() { // 카테고리메뉴

   const pathname = usePathname();
   

   const ca_test = [
      {name: '코스튬/속옷', thumbnail: '/resources/images/category/ca_costum.png', width: 40,},
      {name: '진동기', thumbnail: '/resources/images/category/ca_suction.png', width: 54,},
      {name: '흡입기', thumbnail: '/resources/images/category/ca_vibrator.png', width: 54,},
   ]

   return (
      <HorizontalFlex className={style.category_wrap}>
         {
            pathname !== "/" ?
            <VerticalFlex className={clsx(style.ca_item, style.ca_all)}>
               <Span>All</Span>
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
      </HorizontalFlex>
   )
}