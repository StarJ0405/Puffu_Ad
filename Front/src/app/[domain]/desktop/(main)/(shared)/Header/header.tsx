import Image from "@/components/Image/Image";
import style from "./header.module.css";
import {SearchBox, HeaderBottom} from './client'
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Div from "@/components/div/Div";
import Link from "next/link";
import Span from "@/components/span/Span";
import clsx from "clsx";

export default async function () {

   const menu1 = [ // 임시 데이터
      { name: 'BEST 상품', link: '/products/'},
      { name: '입고예정', link: '/products/'},
      { name: '신상품', link: '/products/'},
      { name: '데이 핫딜', link: '/products/', icon: '/resources/images/header/HotDeal_icon.png'},
      { name: '랜덤박스', link: '/products/'},
   ]

   const menu2 = [ // 임시 데이터
      { name: '포토 사용후기', link: '/board/photoReview'},
      { name: '공지사항', link: '/board/notice'},
      { name: '이벤트', link: '/board/event'},
      {
         name: '고객센터', 
         link: '/board/notice', 
         inner: [
            {name: '공지사항', link: '/board/notice'},
            {name: '1:1문의', link: '/board/inquiry'},
            {name: '이벤트', link: '/board/Event'},
         ]
      },
   ]

   return (
      <>
         <header className={style.header}>
            <HorizontalFlex className="desktop_container" alignItems="end" marginBottom={35}>
               <FlexChild gap={20}>
                  <FlexChild className={style.logo}>
                     <Link href='/'>
                        <Image
                           src='/resources/images/header/logo.png'
                           width={150}
                           height={'auto'}
                        />
                     </Link>
                  </FlexChild>

                  <SearchBox /> {/* 검색창 */}
               </FlexChild>

               <FlexChild width={'auto'} className={style.info_box}>
                  <VerticalFlex gap={20} alignItems="end">
                     <HorizontalFlex gap={20} className={style.info_top} width={'auto'}>
                        <Link href={'/mypage/inquery'}>로그인</Link>
                     </HorizontalFlex>

                     <HorizontalFlex width={'auto'} gap={10}>
                        <FlexChild>
                           <Image src='/resources/icons/main/user_icon.png' width={28} height={'auto'} cursor="pointer"/>
                        </FlexChild>

                        <FlexChild>
                           <Link href={'/cart'}><Image src='/resources/icons/main/cart_icon.png' width={30} height={'auto'} cursor="pointer"/></Link>
                        </FlexChild>

                        <FlexChild>
                           <Image src='/resources/icons/main/product_heart_icon.png' width={30} height={'auto'} cursor="pointer"/>
                        </FlexChild>
                     </HorizontalFlex>
                  </VerticalFlex>
               </FlexChild>
            </HorizontalFlex>

            <HeaderBottom menu1={menu1} menu2={menu2}/>
         </header>
      </>
   )
}
