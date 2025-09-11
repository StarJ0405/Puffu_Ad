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
import style from "./headerCategory.module.css";

export function HeaderCatgeory({CaOpen} : {CaOpen : boolean}) { // 카테고리메뉴

   const ca_test = [
      {name: '남성토이', thumbnail: '/resources/images/dummy_img/ca_menu_01.png'},
      {name: '여성토이', thumbnail: '/resources/images/dummy_img/ca_menu_02.png'},
      {name: '윤활제/젤', thumbnail: '/resources/images/dummy_img/ca_menu_03.png'},
      {name: '콘돔', thumbnail: '/resources/images/dummy_img/ca_menu_04.png'},
      {name: '의류', thumbnail: '/resources/images/dummy_img/ca_menu_04.png'},
      {name: 'BDSM토이', thumbnail: '/resources/images/dummy_img/ca_menu_04.png'},
      {name: 'LGBT토이', thumbnail: '/resources/images/dummy_img/ca_menu_04.png'},
   ]

   return (
      <Div 
         className={clsx(style.overlay, "desktop_container", {
            [style.isOverlayVisible]: CaOpen,
         })}

         // onMouseLeave={toggleOverlay}
         // onMouseEnter={() => {
         // setCategoryListHover(true);
         // }}
         // onMouseLeave={() => {
         // setCategoryListHover(false);
         // }}
         // top={`${headerH}px`}
      >
         <HorizontalFlex className={style.category_wrap}>
            <nav className={style.ca_tab1}>
               {
                  ca_test.map((cat, i) => (
                     <FlexChild key={i}
                        // key={cat.id}
                        className={style.tab_item}
                           backgroundColor={'#262626'}
                        // backgroundColor={
                        //   cat.id === activeDepth1
                        //     ? "var(--main-color)"
                        //     : "#F7F8F9"
                        // }
                        // onMouseEnter={() => {
                        //   setActiveDepth1(cat.id);
                        //   setActiveDepth2(null);
                        // }}
                        // onClick={() => {
                        //   handleCategoryClick(cat, !hasChild(cat));
                        // }}
                     >
                        <P
                           // color={
                           //   cat.id === activeDepth1
                           //     ? "#fff"
                           //     : "var(--normal-color1)"
                           // }
                        >
                           {cat.name}
                        </P>
                     </FlexChild>
                  ))
               }
            </nav>
   
            <VerticalFlex className={style.ca_tabBox}>
               <FlexChild 
                  className={style.tab_title}
                  // onClick={() =>
                  //   handleCategoryClick(
                  //     categories.find((c) => c.id === activeDepth1),
                  //     true
                  //   )
                  // }
               >
                  <P>
                     {/* {flagCode === "cn"
                     ? categories.find((c) => c.id === activeDepth1)
                        ?.name
                     : categories.find((c) => c.id === activeDepth1)
                        ?.metadata?.name ||
                        categories.find((c) => c.id === activeDepth1)
                        ?.name} */}
                        대분류명
                  </P>
                  <Image src={'/resources/icons/arrow/foldBtn_black.png'} width={7} />
               </FlexChild>
   
               <FlexChild
                  className={style.itemBox}
               >
                  <VerticalFlex className={style.ca_item}
                     // onClick={() =>
                     //   handleCategoryClick(
                     //     categories.find(
                     //       (c) => c.id === activeDepth1
                     //     ),
                     //     true
                     //   )
                     // }
                  >
                     <Image src={ca_test[0].thumbnail} width={60}/>
                     <P>
                        {ca_test[0].name}
                     </P>
                  </VerticalFlex>
               </FlexChild>
            </VerticalFlex>

            <VerticalFlex className={clsx(style.ca_tabBox, style.depth3List)}>
               <FlexChild 
                  className={style.tab_title}
                  // onClick={() =>
                  //   handleCategoryClick(
                  //     categories.find((c) => c.id === activeDepth1),
                  //     true
                  //   )
                  // }
               >
                  <P>
                     {/* {flagCode === "cn"
                     ? categories.find((c) => c.id === activeDepth1)
                        ?.name
                     : categories.find((c) => c.id === activeDepth1)
                        ?.metadata?.name ||
                        categories.find((c) => c.id === activeDepth1)
                        ?.name} */}
                        중분류명
                  </P>
                  <Image src={'/resources/icons/arrow/foldBtn_black.png'} width={7} />
               </FlexChild>

               <FlexChild className={style.itemBox}>
                  {
                     ca_test.map((cat, i) => (
                        <VerticalFlex key={i}
                           // key={cat.id}
                           className={clsx(style.ca_item)}
                           // onClick={() => {
                           //   handleCategoryClick(cat, true);
                           // }}
                        >
                           <Image src={cat?.thumbnail} width={60}/>
                           <P color="inherit">
                              {/* {flagCode === "cn"
                                 ? cat.name
                                 : cat.metadata?.name || cat.name} */}
                              {cat.name}
                           </P>
                        </VerticalFlex>
                     ))
                  }
               </FlexChild>
            </VerticalFlex>
         </HorizontalFlex>
      </Div>
   )
}