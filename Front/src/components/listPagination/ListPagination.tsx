'use Client'
import React from "react";
import HorizontalFlex from "../flex/HorizontalFlex";
import FlexChild from "../flex/FlexChild";
import Image from "../Image/Image";
import clsx from "clsx";
import styles from "./ListPagination.module.css";

function ListPagination() {

   const pagingTest = [0,1,2,3,4,5];

   return (
      <HorizontalFlex className={styles.pagingBox}>
         <FlexChild className={clsx(styles.first_btn, styles.paging)}>
            <Image src={'/resources/icons/arrow/list_paging_first.png'} width={10} />
         </FlexChild>
         <FlexChild className={clsx(styles.prev_btn, styles.paging)}>
            <Image src={'/resources/icons/arrow/list_paging_prev.png'} width={6} />
         </FlexChild>

         {
            pagingTest.map((num, i)=> (
               <FlexChild className={clsx(styles.num_btn, styles.paging, (styles.active))} key={i}>
                  {num + 1}
               </FlexChild>
            ))
         }

         <FlexChild className={clsx(styles.next_btn, styles.paging)}>
            <Image src={'/resources/icons/arrow/list_paging_next.png'} width={6} />
         </FlexChild>
         <FlexChild className={clsx(styles.last_btn, styles.paging)}>
            <Image src={'/resources/icons/arrow/list_paging_last.png'} width={10} />
         </FlexChild>
      </HorizontalFlex>
   )
}

export default ListPagination;