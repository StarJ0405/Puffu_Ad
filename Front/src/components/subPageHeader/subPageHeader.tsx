"use client"
import Image from "@/components/Image/Image";
import styles from "./subPageHeader.module.css";
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
import { useParams } from "next/navigation";


export default function SubPageHeader() {

   const [active, setActive] = useState(true);
   const navigate = useNavigate();
   const params = useParams();

   return (
      <HorizontalFlex className={styles.subHeader}>
         <FlexChild gap={20}>
            <FlexChild width={'auto'} onClick={()=> navigate(-1)}>
               <Image src={'/resources/icons/arrow/slide_arrow.png'} width={12} />
            </FlexChild>

            <FlexChild width={'auto'} className={styles.page_title}>
               <P>코스튬/속옷</P>
            </FlexChild>
         </FlexChild>

         <FlexChild gap={15}>
            <FlexChild width={'auto'} onClick={()=> navigate('/')}>
               <Image src={'/resources/images/bottomNavi/navi_home.png'} width={26} />
            </FlexChild>

            <FlexChild width={'auto'} onClick={()=> navigate('/orders/cart')}>
               <Image src={'/resources/images/bottomNavi/navi_cart.png'} width={26} />
            </FlexChild>
         </FlexChild>
      </HorizontalFlex>
   )
}
