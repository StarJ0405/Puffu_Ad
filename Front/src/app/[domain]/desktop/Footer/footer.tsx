import Image from "@/components/Image/Image";
import style from "./footer.module.css";
import {SearchBox, CategoryBtn} from './client'
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Div from "@/components/div/Div";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import Link from "next/link";
import clsx from "clsx";

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

                     <FlexChild>
                        <Link href={'/'}>이용약관</Link>
                        <Span>|</Span>
                        <Link href={'/'}>개인정보처리방침</Link>
                     </FlexChild>
                  </VerticalFlex>

               </VerticalFlex>

               <VerticalFlex className={style.Cs_center} alignItems={'start'}>
                  <P>CS CENTER</P>
                  <P>010-7627-3243</P>
                  <P>평일 : 09:30 ~ 18:30</P>
                  <P>점심시간 : 12:00 ~ 13:00</P>
               </VerticalFlex>
            </HorizontalFlex>
         </footer>
      </>
   )
}
