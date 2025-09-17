// components/listPagination/ListPagination.tsx
'use client' // ✅ 소문자

import React, { useMemo } from "react";
import HorizontalFlex from "../flex/HorizontalFlex";
import FlexChild from "../flex/FlexChild";
import Image from "../Image/Image";
import clsx from "clsx";
import styles from "./ListPagination.module.css";
import { useBrowserEvent } from "@/providers/BrowserEventProvider/BrowserEventProviderClient";
import VerticalFlex from "../flex/VerticalFlex";

type Props = {
   page: number;
   totalPages: number;
   onChange: (page: number) => void;
};

function ListPagination({ page, totalPages, onChange }: Props) {
   const { isMobile } = useBrowserEvent();
   const windowSize = isMobile ? 5 : 10;

   const numbers = useMemo(() => {
      if (totalPages <= 0) return [] as number[];
      const start = Math.floor(page / windowSize) * windowSize;
      const end = Math.min(start + windowSize, totalPages);
      return Array.from({ length: end - start }, (_, i) => start + i);
   }, [page, totalPages, windowSize]);

   const goFirst = () => onChange(0);
   const goPrev = () => onChange(Math.max(page - 1, 0));
   const goNext = () => onChange(Math.min(page + 1, totalPages - 1));
   const goLast = () => onChange(totalPages - 1);

   const NumberButtons = (
      <>
         {numbers.map((n) => (
            <FlexChild
               key={n}
               className={clsx(styles.num_btn, styles.paging, n === page && styles.active)}
               onClick={() => onChange(n)}
               aria-label={`페이지 ${n + 1}`}
            >
               {n + 1}
            </FlexChild>
         ))}
      </>
   );

   // PC
   if (!isMobile) {
      return (
         <HorizontalFlex className={styles.pagingBox}>
            <FlexChild className={clsx(styles.first_btn, styles.paging)} onClick={goFirst}>
               <Image src={'/resources/icons/arrow/list_paging_first.png'} width={10} />
            </FlexChild>
            <FlexChild className={clsx(styles.prev_btn, styles.paging)} onClick={goPrev}>
               <Image src={'/resources/icons/arrow/list_paging_prev.png'} width={6} />
            </FlexChild>

            {NumberButtons}

            <FlexChild className={clsx(styles.next_btn, styles.paging)} onClick={goNext}>
               <Image src={'/resources/icons/arrow/list_paging_next.png'} width={6} />
            </FlexChild>
            <FlexChild className={clsx(styles.last_btn, styles.paging)} onClick={goLast}>
               <Image src={'/resources/icons/arrow/list_paging_last.png'} width={10} />
            </FlexChild>
         </HorizontalFlex>
      );
   }

   // Mobile
   return (
      <VerticalFlex gap={10}>
         <FlexChild className={styles.pagingBox}>{NumberButtons}</FlexChild>

         <FlexChild justifyContent="center" gap={20}>
            <FlexChild width={'auto'} gap={10} className={styles.pagingBox}>
               <FlexChild className={clsx(styles.first_btn, styles.paging)} onClick={goFirst}>
                  <Image src={'/resources/icons/arrow/list_paging_first.png'} width={10} />
               </FlexChild>
               <FlexChild className={clsx(styles.prev_btn, styles.paging)} onClick={goPrev}>
                  <Image src={'/resources/icons/arrow/list_paging_prev.png'} width={6} />
               </FlexChild>
            </FlexChild>

            <FlexChild width={'auto'} gap={10} className={styles.pagingBox}>
               <FlexChild className={clsx(styles.next_btn, styles.paging)} onClick={goNext}>
                  <Image src={'/resources/icons/arrow/list_paging_next.png'} width={6} />
               </FlexChild>
               <FlexChild className={clsx(styles.last_btn, styles.paging)} onClick={goLast}>
                  <Image src={'/resources/icons/arrow/list_paging_last.png'} width={10} />
               </FlexChild>
            </FlexChild>
         </FlexChild>
      </VerticalFlex>
   );
}

export default ListPagination;
