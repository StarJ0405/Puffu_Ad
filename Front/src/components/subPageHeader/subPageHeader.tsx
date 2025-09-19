"use client"
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import useNavigate from "@/shared/hooks/useNavigate";
import { useParams, usePathname } from "next/navigation";
import { useState } from "react";
import styles from "./subPageHeader.module.css";
import {CartLength} from "./client"


export default function SubPageHeader() {

   const [active, setActive] = useState(true);
   const navigate = useNavigate();
   const params = useParams();
   const pathname = usePathname();

   return (
      <HorizontalFlex className={styles.subHeader}>
         <FlexChild gap={20}>
            <FlexChild width={'auto'} onClick={()=> navigate(-1)}>
               <Image src={'/resources/icons/arrow/slide_arrow.png'} width={12} />
            </FlexChild>

            <FlexChild width={'auto'} className={styles.page_title}>
               {pathname.includes("/orders/cart") && (<P>장바구니</P>)}
               {pathname.includes("/orders/complete") && (<P>결제 완료</P>)}
               {pathname.includes("/board/notice") && (<P>공지사항</P>)}
               {pathname.includes("/board/inquiry") && (<P>1:1문의</P>)}
               {pathname.includes("/board/event") && (<P>이벤트</P>)}
               {pathname.includes("/mypage") && (<P>마이페이지</P>)}
            </FlexChild>
         </FlexChild>

         <FlexChild gap={15}>
            <FlexChild width={'auto'} onClick={()=> navigate('/')}>
               <Image src={'/resources/images/bottomNavi/navi_home.png'} width={26} />
            </FlexChild>

            {!pathname.includes("/orders/cart") && (
               <FlexChild className={styles.cart_btn} width={'auto'} onClick={()=> navigate('/orders/cart')}>
                  <Image src={'/resources/images/bottomNavi/navi_cart.png'} width={26} />
                  <CartLength />
               </FlexChild>
            )}
         </FlexChild>
      </HorizontalFlex>
   )
}

