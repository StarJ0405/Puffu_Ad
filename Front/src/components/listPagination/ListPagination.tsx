'use client';
import React from "react";
import HorizontalFlex from "../flex/HorizontalFlex";
import FlexChild from "../flex/FlexChild";
import Image from "../Image/Image";
import clsx from "clsx";
import styles from "./ListPagination.module.css";
import { useBrowserEvent } from "@/providers/BrowserEventProvider/BrowserEventProviderClient";
import VerticalFlex from "../flex/VerticalFlex";

type Props = {
   page: number;
   maxPage: number;
   onChange: (next: number) => void;
   size?: number;
};

function ListPagination({ page, maxPage, onChange, size = 10 }: Props) {
   const { isMobile } = useBrowserEvent();

   const go = (p: number) => onChange(Math.max(0, Math.min(p, maxPage)));
   const start = page - (page % size);
   const pages = Array.from(
      { length: Math.min(size, maxPage - start + 1) },
      (_, i) => start + i
   );


   const first = page === 0;
   const last = page === maxPage;



   return (
      <>
         {!isMobile ? (
            // PC
            <HorizontalFlex className={styles.pagingBox}>
               <FlexChild
                  className={clsx(styles.first_btn, styles.paging, first && styles.disabled)}
                  onClick={() => !first && go(0)}
               >
                  <Image src={"/resources/icons/arrow/list_paging_first.png"} width={10} />
               </FlexChild>
               <FlexChild
                  className={clsx(styles.prev_btn, styles.paging, first && styles.disabled)}
                  onClick={() => !first && go(page - 1)}
               >
                  <Image src={"/resources/icons/arrow/list_paging_prev.png"} width={6} />
               </FlexChild>
               <>
                  {pages.map((p) => (
                     <FlexChild
                        key={p}
                        className={clsx(styles.num_btn, styles.paging, p === page && styles.active)}
                        onClick={() => go(p)}
                     >
                        {p + 1}
                     </FlexChild>
                  ))}
               </>
               <FlexChild
                  className={clsx(styles.next_btn, styles.paging, last && styles.disabled)}
                  onClick={() => !last && go(page + 1)}
               >
                  <Image src={"/resources/icons/arrow/list_paging_next.png"} width={6} />
               </FlexChild>
               <FlexChild
                  className={clsx(styles.last_btn, styles.paging, last && styles.disabled)}
                  onClick={() => !last && go(maxPage)}
               >
                  <Image src={"/resources/icons/arrow/list_paging_last.png"} width={10} />
               </FlexChild>
            </HorizontalFlex>
         ) : (
            // Mobile
            <HorizontalFlex className={styles.pagingBox}>
              <FlexChild
                className={clsx(styles.first_btn, styles.paging, first && styles.disabled)}
                onClick={() => !first && go(0)}
              >
                <Image src={"/resources/icons/arrow/list_paging_first.png"} width={10} />
              </FlexChild>
              <FlexChild
                className={clsx(styles.prev_btn, styles.paging, first && styles.disabled)}
                onClick={() => !first && go(page - 1)}
              >
                <Image src={"/resources/icons/arrow/list_paging_prev.png"} width={6} />
              </FlexChild>
              <>
                {pages.map((p) => (
                  <FlexChild
                    key={p}
                    className={clsx(styles.num_btn, styles.paging, p === page && styles.active)}
                    onClick={() => go(p)}
                  >
                    {p + 1}
                  </FlexChild>
                ))}
              </>
              <FlexChild
                className={clsx(styles.next_btn, styles.paging, last && styles.disabled)}
                onClick={() => !last && go(page + 1)}
              >
                <Image src={"/resources/icons/arrow/list_paging_next.png"} width={6} />
              </FlexChild>
              <FlexChild
                className={clsx(styles.last_btn, styles.paging, last && styles.disabled)}
                onClick={() => !last && go(maxPage)}
              >
                <Image src={"/resources/icons/arrow/list_paging_last.png"} width={10} />
              </FlexChild>
            </HorizontalFlex>
         )}
      </>
   );
}

export default ListPagination;
