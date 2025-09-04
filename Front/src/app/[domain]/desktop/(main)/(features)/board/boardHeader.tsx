import Image from "@/components/Image/Image";
import style from "./boardHeader.module.css";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import P from "@/components/P/P";
import Div from "@/components/div/Div";
import Link from "next/link";
import Span from "@/components/span/Span";
import clsx from "clsx";

export default async function () {

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
      <VerticalFlex className={style.board_header}>
         <VerticalFlex className={style.customer_info}>
            <FlexChild>
               <h3>고객센터</h3>
            </FlexChild>
   
            <FlexChild className={style.call_number}>
               <P>010-7627-3243</P>
            </FlexChild>
   
            <VerticalFlex className={style.business_time} gap={5}>
               <P>평일 : 09:30 ~ 18:30</P>
               <P>점심시간 : 12:00 ~ 13:00</P>
            </VerticalFlex>
         </VerticalFlex>



         <HorizontalFlex className={style.board_navi}>

            <FlexChild className={clsx(style.item, style.active)}>
               <Link href={'/board/notice'}>공지사항</Link>
            </FlexChild>

            <FlexChild className={clsx(style.item)}>
               <Link href={'/board/inquiry'}>1:1문의</Link>
            </FlexChild>

            <FlexChild className={clsx(style.item)}>
               <Link href={'/board/event'}>이벤트</Link>
            </FlexChild>
         </HorizontalFlex>
      </VerticalFlex>
   )
}
