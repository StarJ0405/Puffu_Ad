'use client';

import React, { useMemo } from "react";
import HorizontalFlex from "../flex/HorizontalFlex";
import FlexChild from "../flex/FlexChild";
import Image from "../Image/Image";
import clsx from "clsx";
import styles from "./ListPagination.module.css";
import { useBrowserEvent } from "@/providers/BrowserEventProvider/BrowserEventProviderClient";
import VerticalFlex from "../flex/VerticalFlex";


interface ListPaginationProps {
  page: number;
  totalPage: number;
  handlePageChange: (page: number) => void;
}

function ListPagination({
  page,
  totalPage,
  handlePageChange,
}: ListPaginationProps) {
  const { isMobile } = useBrowserEvent();
  const pageLimit = 5;

  const currentPageGroup = Math.ceil(page / pageLimit);
  const totalPageGroups = Math.ceil(totalPage / pageLimit);

  const pages = useMemo(() => {
    const startPage = (currentPageGroup - 1) * pageLimit + 1;
    const endPage = Math.min(startPage + pageLimit - 1, totalPage);
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }, [currentPageGroup, totalPage]);


  const goToFirstPage = () => handlePageChange(1);
  const goToLastPage = () => handlePageChange(totalPage);
  const goToPrevPage = () => handlePageChange(Math.max(1, page - 1));
  const goToNextPage = () => handlePageChange(Math.min(totalPage, page + 1));
  const goToPrevGroup = () => {
    const prevGroupStartPage = (currentPageGroup - 2) * pageLimit + 1;
    handlePageChange(Math.max(1, prevGroupStartPage));
  };
  const goToNextGroup = () => {
    const nextGroupStartPage = currentPageGroup * pageLimit + 1;
    handlePageChange(Math.min(totalPage, nextGroupStartPage));
  };

  if (totalPage <= 1) return null;


  return (
    <>
      {!isMobile ? (
        //pc
        <HorizontalFlex className={styles.pagingBox}>
          <FlexChild
            className={clsx(styles.first_btn, styles.paging)}
            onClick={goToFirstPage}
          >
            <Image
              src={"/resources/icons/arrow/list_paging_first.png"}
              width={10}
            />
          </FlexChild>
          <FlexChild
            className={clsx(styles.prev_btn, styles.paging)}
            onClick={goToPrevPage}
          >
            <Image
              src={"/resources/icons/arrow/list_paging_prev.png"}
              width={6}
            />
          </FlexChild>

          {pages.map((pageNum) => (
            <FlexChild
              className={clsx(styles.num_btn, styles.paging, {
                [styles.active]: pageNum === page,
              })}
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
            >
              {pageNum}
            </FlexChild>
          ))}

          <FlexChild
            className={clsx(styles.next_btn, styles.paging)}
            onClick={goToNextPage}
          >
            <Image
              src={"/resources/icons/arrow/list_paging_next.png"}
              width={6}
            />
          </FlexChild>
          <FlexChild
            className={clsx(styles.last_btn, styles.paging)}
            onClick={goToLastPage}
          >
            <Image
              src={"/resources/icons/arrow/list_paging_last.png"}
              width={10}
            />
          </FlexChild>
        </HorizontalFlex>
      ) : (
        // 모바일
        <VerticalFlex gap={10}>
          <FlexChild className={styles.pagingBox}>
            {pages.map((pageNum) => (
              <FlexChild
                className={clsx(styles.num_btn, styles.paging, {
                  [styles.active]: pageNum === page,
                })}
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
              >
                {pageNum}
              </FlexChild>
            ))}
          </FlexChild>

          <FlexChild justifyContent="center" gap={20}>
            <FlexChild width={"auto"} gap={10} className={styles.pagingBox}>
              <FlexChild
                className={clsx(styles.first_btn, styles.paging)}
                onClick={goToFirstPage}
              >
                <Image
                  src={"/resources/icons/arrow/list_paging_first.png"}
                  width={10}
                />
              </FlexChild>
              <FlexChild
                className={clsx(styles.prev_btn, styles.paging)}
                onClick={goToPrevPage}
              >
                <Image
                  src={"/resources/icons/arrow/list_paging_prev.png"}
                  width={6}
                />
              </FlexChild>
            </FlexChild>

            <FlexChild width={"auto"} gap={10} className={styles.pagingBox}>
              <FlexChild
                className={clsx(styles.next_btn, styles.paging)}
                onClick={goToNextPage}
              >
                <Image
                  src={"/resources/icons/arrow/list_paging_next.png"}
                  width={6}
                />
              </FlexChild>
              <FlexChild
                className={clsx(styles.last_btn, styles.paging)}
                onClick={goToLastPage}
              >
                <Image
                  src={"/resources/icons/arrow/list_paging_last.png"}
                  width={10}
                />
              </FlexChild>
            </FlexChild>
          </FlexChild>
        </VerticalFlex>
      )}
    </>
  );

}

export default ListPagination;
