"use client"

import siteInfo from "@/shared/siteInfo";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import clsx from "clsx";
import Link from "next/link";
import { HeaderBottom } from './client';
import styles from "./header.module.css";
import { useParams, usePathname } from "next/navigation";
import SearchLayer from "@/components/searchLayer/SearchLayer"
import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CountBadge from "@/components/countBadge/countBadge";
import LineBanner from "@/components/main/lineBanner/LineBanner";


export default function MobileHeader() {

   const menu1 = [ // 임시 데이터
      { name: '상품', link: siteInfo.pt_best},
      { name: '픽업매장', link: siteInfo.map_location},
      { name: '멤버쉽&구독', link: '/?'},
      { name: '이벤트', link: siteInfo.bo_event},
      { name: '사용후기', link: siteInfo.bo_review},
      { name: '창업안내', link: siteInfo.startUps},
   ]

   const params = useParams();
   const pathname = usePathname();
   const [showSearch, setShowSearch] = useState(false);
   const bodyOverflow = (e: string) => {
    document.body.style.overflow = e;
  }
   const isDetailPage = !!params?.detail_id;

   const headerRef = useRef<HTMLDivElement | null>(null);
   const [headerScroll, setHeaderScroll] = useState(false);
   const [LBHeight, setLBHeight] = useState(0);

   // 스크롤 되면 클래스 들어옴
   const ScrollClass = headerScroll ? styles.scroll : '';

   useEffect(()=> {
      const headerScroll = () => {
         setHeaderScroll(window.scrollY > 0)
      };

      window.addEventListener('scroll', headerScroll);
      return ()=> window.removeEventListener('scroll', headerScroll);
   },[]);


   // 검색 버튼 눌러서 검색 페이지 나오면 바디 스크롤바 숨기기
   const shouldHideHeader = 
   pathname.includes("/orders") || pathname.includes("/border") || pathname.includes("/mypage") || pathname.includes("/board") 
   || isDetailPage;

   useEffect(()=> {
      if(showSearch) {
         bodyOverflow('hidden');
      } else {
         bodyOverflow('');
      }

      return () => {
         bodyOverflow('');
      }
   }, [showSearch]);

   return (
      <>
         {  
            // || pathname === '/board/photoReview'
            !shouldHideHeader ? (
               <>
                  <header ref={headerRef} className={clsx(ScrollClass, styles.header)} style={{ top: headerScroll ? `-${LBHeight}px` : 0 }}>
                     <LineBanner setLBHeight={setLBHeight} />
                     <HorizontalFlex className={clsx('mob_page_container',styles.headerTop)}>
                        <FlexChild className={styles.logo}>
                           <Link href='/'>
                              <Image
                                 src='/resources/images/header/logo.png'
                                 width={120}
                                 height={'auto'}
                              />
                           </Link>
                        </FlexChild>
   
                        <FlexChild width={'auto'} className={styles.info_box}>
                           <VerticalFlex gap={20} alignItems="end">
                              <FlexChild width={'auto'} gap={20}>
                                 <FlexChild onClick={()=> setShowSearch(true)}>
                                    <Image src='/resources/icons/main/search_icon.png' width={20} cursor="pointer"/>
                                 </FlexChild>
   
                                 <FlexChild className={styles.cart_btn}>
                                    <Link href={'/orders/cart'}>
                                       <Image src='/resources/icons/main/cart_icon.png' width={20} cursor="pointer"/>
                                    </Link>
                                    <CountBadge bottom="-3px" right="-5px" />
                                 </FlexChild>
                              </FlexChild>
                           </VerticalFlex>
                        </FlexChild>
                     </HorizontalFlex>
   
                     <HeaderBottom menu1={menu1}/>
                  </header>


                  {/* 모바일 검색창 페이지 */}
                  <AnimatePresence mode="wait" onExitComplete={()=> bodyOverflow('')}>
                  {
                     showSearch && (
                        <motion.div
                           id="motion"
                           key={showSearch ? "search-open" : "search-closed"}
                           initial={{ opacity: 0, y: -20,}}
                           animate={{ opacity: 1, y: 0,}}
                           exit={{ opacity: 0, y: 0 }}
                           transition={{ duration: 0.2, ease: "easeInOut" }}
                           style={{
                              position: "fixed",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "100vh",
                              background: "#111",   // 검색창 배경색
                              zIndex: 1200,         // 다른 UI 위로
                           }}
                        >
                           <SearchLayer onClose={() => setShowSearch(false)} />
                        </motion.div>
                     )
                  }
                  </AnimatePresence>
               </>
            ) : (
               <div style={{display: "none"}}></div>
            )
         }
      </>
   )
}
