"use client";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import NoContent from "@/components/noContent/noContent";
import P from "@/components/P/P";
import styles from "./page.module.css";
import ListPagination from "@/components/listPagination/ListPagination";
import FlexChild from "@/components/flex/FlexChild";

export function HistoryList({
   initCoupons,
}: {
   initCoupons: Pageable;
}) {
  const test = [
    {
      title: "연간 구독권 2차 결제",
      price: 49800,
      date: "2025.09.01",
    },

    {
      title: "연간 구독권 1차 결제",
      price: 49800,
      date: "2024.09.01",
    },
  ];

  return (
    <VerticalFlex gap={35}>
      <VerticalFlex className={styles.payment_list}>
        {test.length > 0 ? (
          test.map((item, i) => {
            return (
               <VerticalFlex className={styles.item} key={i}>
                  <FlexChild>
                     <P className={styles.date}>
                        {item.date}
                     </P>
                  </FlexChild>

                  <FlexChild>
                     <P className={styles.title}>
                        {item.title}
                     </P>
                  </FlexChild>

                  <FlexChild justifyContent="end" className={styles.price_box}>
                     <P className={styles.price}>
                        {(item.price || 0).toLocaleString()}원
                     </P>
                  </FlexChild>
               </VerticalFlex>
            );
          })
        ) : (
          <NoContent type="결제" />
        )}
      </VerticalFlex>

      {/* <ListPagination
         page={page}
         maxPage={maxPage}
         onChange={setPage}
         size={PAGE_SIZE}
      /> */}
    </VerticalFlex>
  );
}
