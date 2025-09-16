'use Client'
import React from "react";
import HorizontalFlex from "../flex/HorizontalFlex";
import FlexChild from "../flex/FlexChild";
import Image from "../Image/Image";
import clsx from "clsx";
import styles from "./ListPagination.module.css";
import { useBrowserEvent } from "@/providers/BrowserEventProvider/BrowserEventProviderClient";
import VerticalFlex from "../flex/VerticalFlex";

function ListPagination() {

   const { isMobile } = useBrowserEvent();

   const pagingTest = [0,1,2,3,4,5];

   return (
      <>
         {
            !isMobile ? (
               //pc
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
            ) : (
               // 모바일
               <VerticalFlex gap={10}>
                  <FlexChild className={styles.pagingBox}>
                     {
                        pagingTest.map((num, i)=> (
                           <FlexChild className={clsx(styles.num_btn, styles.paging, (styles.active))} key={i}>
                              {num + 1}
                           </FlexChild>
                        ))
                     }
                  </FlexChild>

                  <FlexChild justifyContent="center" gap={20}>
                     <FlexChild width={'auto'} gap={10} className={styles.pagingBox}>
                        <FlexChild className={clsx(styles.first_btn, styles.paging)}>
                           <Image src={'/resources/icons/arrow/list_paging_first.png'} width={10} />
                        </FlexChild>
                        <FlexChild className={clsx(styles.prev_btn, styles.paging)}>
                           <Image src={'/resources/icons/arrow/list_paging_prev.png'} width={6} />
                        </FlexChild>
                     </FlexChild>
   
                     <FlexChild width={'auto'} gap={10} className={styles.pagingBox}>
                        <FlexChild className={clsx(styles.next_btn, styles.paging)}>
                           <Image src={'/resources/icons/arrow/list_paging_next.png'} width={6} />
                        </FlexChild>
                        <FlexChild className={clsx(styles.last_btn, styles.paging)}>
                           <Image src={'/resources/icons/arrow/list_paging_last.png'} width={10} />
                        </FlexChild>
                     </FlexChild>
                  </FlexChild>
               </VerticalFlex>
            )
         }
      </>
   )
}

export default ListPagination;