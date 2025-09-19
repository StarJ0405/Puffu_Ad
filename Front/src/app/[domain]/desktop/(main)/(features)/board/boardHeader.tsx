'use client'
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import P from "@/components/P/P";
import clsx from "clsx";
import Link from "next/link";
import styles from "./boardHeader.module.css";
import {BoardNavi} from "./client";
import { usePathname } from "next/navigation";

export default function BoardHeader() {

   const pathname = usePathname();

   // header를 보여줄 path들
   const showHeaderPaths = ["/board/notice", "/board/event", "/board/faq", "/board/inquiry"];

   // 현재 경로가 위 목록에 포함되면 true
   const showHeader = showHeaderPaths.includes(pathname);

   const menu1 = [ // 임시 데이터
      { name: 'BEST 상품', link: '/product'},
      { name: '신상품', link: '/product'},
      { name: '데이 핫딜', link: '/product', icon: '/resources/images/header/HotDeal_icon.png'},
      { name: '랜덤박스', link: '/product'},
   ]

   const menu2 = [ // 임시 데이터
      { name: '포토 사용후기', link: '/Boad/ReviewPhoto'},
      { name: '공지사항', link: '/Boad/Notice'},
      { name: '이벤트', link: '/Boad/Event'},
      // { 
      //    name: '커뮤니티', 
      //    link: '/Boad/Community', 
      //    inner: [
      //       {name: '자유게시판', link: '/Boad/Community'},
      //       {name: '포토사용후기', link: '/Boad/ReviewPhoto'},
      //       {name: '유머/움짤', link: '/Boad/Funny'},
      //       {name: '안구정화', link: '/Boad/Purify'},
      //       {name: '성 상담소', link: '/Boad/Counseling'},
      //       {name: '입문자 가이드', link: '/Boad/NewbieGuide'},
      //    ]
      // },
      {
         name: '고객센터', 
         link: '/Boad/CustomerCenter', 
         inner: [
            {name: '공지사항', link: '/Boad/Notice'},
            {name: '자주 묻는 질문', link: '/Boad/FAQ'},
            {name: '1:1문의', link: '/Boad/Q&A'},
            {name: '이벤트', link: '/Boad/Event'},
         ]
      },
   ]

   return (
      <>
         {
            showHeader ? (
               <VerticalFlex className={styles.board_header}>
                  <VerticalFlex className={styles.customer_info}>
                     <FlexChild>
                        <h3>고객센터</h3>
                     </FlexChild>
            
                     <FlexChild className={styles.call_number}>
                        <P>010-2349-8677</P>
                     </FlexChild>
            
                     <VerticalFlex className={styles.business_time} gap={5}>
                        <P>평일 : 09:30 ~ 18:30</P>
                        <P>점심시간 : 12:00 ~ 13:00</P>
                     </VerticalFlex>
                  </VerticalFlex>
   
   
                  <BoardNavi />
               </VerticalFlex>
            ) : (
               <div></div>
            )
         }
      </>
   )
}
