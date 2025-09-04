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
import style from "./noContent.module.css";




export function NoContent() {

   const pathname = usePathname();

   return (
      <>
         <VerticalFlex>
            <FlexChild>
               <P>
                  {pathname.includes("/board") && ('게시물이 없습니다.')}
                  {pathname.startsWith("/") && ('현재 상품이 없습니다.')}
                  {pathname.includes("/product") && ('현재 상품이 없습니다.')}
                  {pathname.includes("/board") && ('게시물이 없습니다.')}
                  {pathname.startsWith("/cart") && ('담긴 상품이 없습니다.')}
               </P>
            </FlexChild>
         </VerticalFlex>
      </>
   )
}

export default NoContent