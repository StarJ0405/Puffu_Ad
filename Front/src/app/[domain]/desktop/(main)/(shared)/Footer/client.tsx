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
import style from "./header.module.css";

export function SearchBox() {
   return (
      <FlexChild gap={10} className={`searchInput_Box ${style.search_Box}`}>
         <input type="search" placeholder="2025 신제품" onClick={()=> {'저는 자아를 가진 검색창입니다.'}} />

         <Image 
            src='/resources/images/header/input_search_icon.png'
            width={18}
            height="auto"
            cursor="pointer"
         />
      </FlexChild>
   )
}

export function CategoryBtn() {
   return (
      <FlexChild gap={10} width={'auto'} className={style.category_btn} onClick={()=> {'저는 자아를 가진 버튼입니다.'}}>
         <Image 
            src='/resources/images/header/category_menu_icon.png'
            width={18}
         />
         <span className='SacheonFont'>카테고리</span>
      </FlexChild>
   )
}
