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
import styles from "./header.module.css";
import {HeaderCatgeory} from './headerCategory'
import Link from "next/link";

interface ShopMenuItem {
   name: string;
   link: string;
   icon?: string; // menu1에 icon이 있음
}

interface SubMenuItem {
   name: string;
   link: string;
}

interface CommunityMenuItem {
   name: string;
   link: string;
   inner?: SubMenuItem[]; // menu2는 inner 조건 처리
}

interface HeaderBottomProps {
   menu1: ShopMenuItem[];
   menu2: CommunityMenuItem[];
}

export function SearchBox() {
   return (
      <FlexChild gap={10} className={`searchInput_Box ${styles.search_Box}`}>
         <input type="search" placeholder="2025 신제품" onClick={()=> {'검색창 클릭'}} />

         <Image 
            src='/resources/images/header/input_search_icon.png'
            width={18}
            height="auto"
            cursor="pointer"
         />
      </FlexChild>
   )
}

export function HeaderBottom({menu1, menu2} : HeaderBottomProps) {

   const bottomRef = useRef<HTMLDivElement | null>(null);
   const [fixed, setFixed] = useState(false);
   const [CaOpen, SetCaOpen] = useState(false);

   useEffect(()=> {
      const headerScroll = () => {
         const elmt = bottomRef.current?.getBoundingClientRect();
         if (!elmt) return;
         setFixed(elmt.top <= 0);
      }

      window.addEventListener('scroll', headerScroll);
      return () => window.removeEventListener('scroll', headerScroll);

   }, [bottomRef]);

   return (
      <>
         <div ref={bottomRef}></div>{/* 헤더 높이계산용 더미 */}
         <div className={`${fixed ? styles.fixed : ''}`}>
            <HorizontalFlex className="desktop_container" position="relative">
               <HorizontalFlex gap={25} justifyContent="start">
                  <FlexChild
                     width={'auto'} 
                     onMouseEnter={() => SetCaOpen(true)}
                     onMouseLeave={() => SetCaOpen(false)}
                     className={styles.CategoryBox}
                  >
                     <FlexChild gap={10} width={'auto'} className={styles.category_btn}>
                        <Image 
                           src='/resources/images/header/category_menu_icon.png'
                           width={18}
                        />
                        <span className='SacheonFont'>카테고리</span>
                     </FlexChild>
                     <HeaderCatgeory CaOpen={CaOpen} />
                  </FlexChild>
   
   
   
                  <FlexChild width={'auto'}>
                     <nav>
                        <ul className={clsx(styles.outerMenu, styles.shop_outer)}>
                           {
                              menu1.map((item, i)=> (
                                 <li key={i}>
                                    <Link href={item.link} className="SacheonFont">
                                       {item.name}
                                       {item.icon ? <Image src={item.icon} width={12} /> : null}
                                    </Link>
                                    <Span className={styles.active_line}></Span>
                                 </li>
                              ))
                           }
                        </ul>
                     </nav>
                  </FlexChild>
               </HorizontalFlex>
   
   
               <FlexChild gap={20} width={'auto'}>
                  <ul className={clsx(styles.outerMenu, styles.commu_outer)}>
                     {
                        menu2.map((item, i)=> (
                           <li key={i}>
                              <Link href={item.link}>
                                 {item.name}
                                 {item.inner ? <Image src={'/resources/icons/arrow/arrow_bottom_icon.png'} width={10} height={'auto'} /> : null}
                              </Link>
   
                              {item.inner && (
                                 <ul className={styles.subMenu}>
                                 {item.inner.map((sub, j) => (
                                    <li key={j}>
                                       <Link href={sub.link}>
                                          {sub.name}
                                       </Link>
                                    </li>
                                 ))}
                                 </ul>
                              )}
                           </li>
                        ))
                     }
                  </ul>
               </FlexChild>
            </HorizontalFlex>
         </div>
      </>
   )
}





