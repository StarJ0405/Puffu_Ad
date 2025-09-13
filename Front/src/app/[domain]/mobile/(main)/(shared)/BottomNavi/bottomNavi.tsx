"use client"
import Image from "@/components/Image/Image";
import styles from "./bottomNavi.module.css";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import useNavigate from "@/shared/hooks/useNavigate";
import Div from "@/components/div/Div";
import Link from "next/link";
import Span from "@/components/span/Span";
import clsx from "clsx";
import { useState } from "react";
import P from "@/components/P/P";


export default function BottomNavi() {

   const [active, setActive] = useState(true);
   const navigate = useNavigate();

   return (
      <HorizontalFlex className={styles.bottom_navi}>
         <VerticalFlex className={styles.item}>
            <Image src={`/resources/images/bottomNavi/navi_category${active && '_active'}.png`} width={20} />
            <FlexChild className={clsx(styles.txt)}>
               <P>카테고리</P>
            </FlexChild>
         </VerticalFlex>

         <VerticalFlex className={styles.item} onClick={()=> navigate('/mypage/wishlist')}>
            <Image src={`/resources/images/bottomNavi/navi_wish${active && '_active'}.png`} width={22} />
            <FlexChild className={clsx(styles.txt)}>
               <P>관심 리스트</P>
            </FlexChild>
         </VerticalFlex>

         <VerticalFlex className={styles.item} onClick={()=> navigate('/')}>
            <Image src={`/resources/images/bottomNavi/navi_home${active && '_active'}.png`} width={22} />
            <FlexChild className={clsx(styles.txt)}>
               <P>홈</P>
            </FlexChild>
         </VerticalFlex>

         <VerticalFlex className={styles.item} onClick={()=> navigate('/orders/cart')}>
            <Image src={`/resources/images/bottomNavi/navi_cart${active && '_active'}.png`} width={21} />
            <FlexChild className={clsx(styles.txt)}>
               <P>장바구니</P>
            </FlexChild>
         </VerticalFlex>

         <VerticalFlex className={styles.item} onClick={()=> navigate('/auth/login')}>
            <Image src={`/resources/images/bottomNavi/navi_login${active && '_active'}.png`} width={22} />
            <FlexChild className={clsx(styles.txt)}>
               <P>로그인</P>
            </FlexChild>
         </VerticalFlex>
      </HorizontalFlex>
   )
}
