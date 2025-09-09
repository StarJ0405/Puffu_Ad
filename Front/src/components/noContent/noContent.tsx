"use client"
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import clsx from "clsx";
import { useParams } from "next/navigation";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import styles from "./noContent.module.css";


export function NoContent({type} : {type : string}) {

   const pathname = usePathname();

   return (
      <>
         <VerticalFlex justifyContent="center">
            <FlexChild width={'auto'} className={styles.NolayerBox}>
               <P>
                  {type === '상품' && ('현재 상품이 없습니다.')}
                  {type === '리뷰' && ('등록된 리뷰가 없습니다.')}
                  {type === '게시판' && ('등록된 게시물이 없습니다.')}
                  {type === '문의' && ('등록된 문의내역이 없습니다.')}
                  {type === '배송지' && ('등록된 배송지가 없습니다.')}
               </P>
            </FlexChild>
         </VerticalFlex>
      </>
   )
}

export default NoContent