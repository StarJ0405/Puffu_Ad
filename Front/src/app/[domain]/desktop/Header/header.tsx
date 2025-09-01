import Image from "@/components/Image/Image";
import style from "./header.module.css";
import {SearchBox, CategoryBox} from './client'
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Div from "@/components/div/Div";
import Link from "next/link";
import Span from "@/components/span/Span";
import clsx from "clsx";

export default async function () { 

   const menu1 = [ // 임시 데이터
      { name: '브랜드', link: '/Brand'},
      { name: 'BEST 상품', link: '/Best'},
      { name: '신상품', link: '/NewProduct'},
      { name: '데이 핫딜', link: '/Sale', icon: '/resources/images/header/HotDeal_icon.png'},
   ]

   const menu2 = [ // 임시 데이터
      { name: '포토 사용후기', link: '/Boad/ReviewPhoto'},
      { name: '공지사항', link: '/Boad/Notice'},
      { name: '이벤트', link: '/Boad/Event'},
      { 
         name: '커뮤니티', 
         link: '/Boad/Community', 
         inner: [
            {name: '자유게시판', link: '/Boad/Community'},
            {name: '포토사용후기', link: '/Boad/ReviewPhoto'},
            {name: '유머/움짤', link: '/Boad/Funny'},
            {name: '안구정화', link: '/Boad/Purify'},
            {name: '성 상담소', link: '/Boad/Counseling'},
            {name: '입문자 가이드', link: '/Boad/NewbieGuide'},
         ]
      },
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
         <header className={style.header}>
            <HorizontalFlex className="desktop_container" alignItems="end">
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
                  <VerticalFlex gap={20}>
                     <HorizontalFlex gap={20} className={style.info_top} width={'auto'}>
                        <span>회원가입</span>
                        <span>KOR</span>
                     </HorizontalFlex>

                     <HorizontalFlex width={'auto'} gap={10}>
                        <FlexChild>
                           <Image src='/resources/icons/main/user_icon.png' width={28} height={'auto'} cursor="pointer"/>
                        </FlexChild>

                        <FlexChild>
                           <Image src='/resources/icons/main/cart_icon.png' width={30} height={'auto'} cursor="pointer"/>
                        </FlexChild>

                        <FlexChild>
                           <Image src='/resources/images/header/heart_icon.png' width={30} height={'auto'} cursor="pointer"/>
                        </FlexChild>
                     </HorizontalFlex>
                  </VerticalFlex>
               </FlexChild>
            </HorizontalFlex>

            <HorizontalFlex className="desktop_container" position="relative">
               <HorizontalFlex gap={25} justifyContent="start">
                  <CategoryBox /> {/* 카테고리 버튼, 카테고리 메뉴 */}

                  <FlexChild width={'auto'}>
                     <ul className={clsx(style.outerMenu, style.shop_outer)}>
                        {
                           menu1.map((item, i)=> (
                              <li key={i}>
                                 <Link href={item.link} className="SacheonFont">
                                    {item.name}
                                    {item.icon ? <Image src={item.icon} width={12} /> : null}
                                 </Link>
                                 <Span className={style.active_line}></Span>
                              </li>
                           ))
                        }
                     </ul>
                  </FlexChild>
               </HorizontalFlex>


               <FlexChild gap={20} width={'auto'}>
                  <ul className={clsx(style.outerMenu, style.commu_outer)}>
                     {
                        menu2.map((item, i)=> (
                           <li key={i}>
                              <Link href={item.link}>
                                 {item.name}
                                 {item.inner ? <Image src={'/resources/icons/arrow/arrow_bottom_icon.png'} width={10} height={'auto'} /> : null}
                              </Link>

                              {item.inner && (
                                 <ul className={style.subMenu}>
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
         </header>
      </>
   )
}
