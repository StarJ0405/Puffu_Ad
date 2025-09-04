import Image from "@/components/Image/Image";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Div from "@/components/div/Div";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import Button from "@/components/buttons/Button";
import Link from "next/link";
import clsx from "clsx";
import style from "./footer.module.css";

import {ChatToggle} from './client'
import TopButton from '@/components/buttons/TopButton'

export default async function () {

   

   return (
      <>
         <footer className={style.footer}>
            <HorizontalFlex className="desktop_container">
               <VerticalFlex className={style.info_box} alignItems="start">
                  <Image 
                     src={'/resources/images/footer/footer_logo.png'}
                     width={150}
                     className={style.footer_logo}
                  />

                  <VerticalFlex alignItems={'start'} className={style.text_box}>
                     <P>푸푸글로벌(주)</P>
                     <FlexChild className={style.txt_item}>
                        <Span>대표: 염희하</Span>
                        <Span>주소: 대전광역시 서구 관저중로 95번길 관저동</Span>
                        <Span>이메일: puffuglobal@gmail.com</Span>
                     </FlexChild>

                     <FlexChild className={style.txt_item}>
                        <Span>사업자등록번호: 559-81-02488</Span>
                        <Span>통신판매업신고번호: 대전광역시 서구-0308</Span>
                     </FlexChild>

                     <FlexChild className={style.txt_item}>
                        <Span>Copyright, ⓒ 2025 puffutoy.com. All rights reserved.</Span>
                     </FlexChild>

                     <FlexChild className={style.policy_item}>
                        <Link href={'/'}>이용약관</Link>
                        <Span>|</Span>
                        <Link href={'/'}>개인정보처리방침</Link>
                     </FlexChild>
                  </VerticalFlex>

               </VerticalFlex>

               <VerticalFlex className={style.Cs_center} alignItems={'start'}>
                  <P className={style.cs_title}>CS CENTER</P>
                  <P className={style.cs_number}>010-7627-3243</P>
                  <VerticalFlex className={style.cs_days}>
                     <P><Span>평일 : </Span>09:30 ~ 18:30</P>
                     <P><Span>점심시간 :</Span> 12:00 ~ 13:00</P>
                  </VerticalFlex>
               </VerticalFlex>
            </HorizontalFlex>
         </footer>


         {/* 사이드 네비 */}
         <nav id={style.sideNavi}>
            <VerticalFlex className={style.outer_box}>
               <Link href={'/sale'} className={style.hotDeal_link}>
                  <Image 
                     src={'/resources/images/footer/sidenavi_hotDeal.png'}
                     width={43}
                  />
                  <h4 className="SacheonFont">데이 HOT딜</h4>
               </Link>

               <ul className={style.link_list}>
                  <li>
                     <Link href={'/mypage'}>마이페이지</Link>
                  </li>
                  <li>
                     <Link href={'/cart'}>장바구니</Link>
                  </li>
                  <li>
                     <Link href={'/wishList'}>위시리스트</Link>
                  </li>
                  <li>
                     <Link href={'/board/faq'}>1:1문의</Link>
                  </li>
               </ul>
            </VerticalFlex>

            <TopButton/>
         </nav>


         <ChatToggle />
      </>
   )
}
