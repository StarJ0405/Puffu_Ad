'use Client'
import React from "react";
import HorizontalFlex from "../flex/HorizontalFlex";
import FlexChild from "../flex/FlexChild";
import Image from "../Image/Image";
import clsx from "clsx";
import style from "./ListPagination.module.css";

function ListPagination() {

   const pagingTest = [0,1,2,3,4,5];

   return (
      <HorizontalFlex className={style.pagingBox}>
         <FlexChild className={clsx(style.first_btn, style.paging)}>
            <Image src={'/resources/icons/arrow/list_paging_first.png'} width={10} />
         </FlexChild>
         <FlexChild className={clsx(style.prev_btn, style.paging)}>
            <Image src={'/resources/icons/arrow/list_paging_prev.png'} width={6} />
         </FlexChild>

         {
            pagingTest.map((num, i)=> (
               <FlexChild className={clsx(style.num_btn, style.paging, (style.active))} key={i}>
                  {num + 1}
               </FlexChild>
            ))
         }

         <FlexChild className={clsx(style.next_btn, style.paging)}>
            <Image src={'/resources/icons/arrow/list_paging_next.png'} width={6} />
         </FlexChild>
         <FlexChild className={clsx(style.last_btn, style.paging)}>
            <Image src={'/resources/icons/arrow/list_paging_last.png'} width={10} />
         </FlexChild>
      </HorizontalFlex>
   )
}

export default ListPagination;