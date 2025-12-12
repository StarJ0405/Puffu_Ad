"use client";
import usePageData from "@/shared/hooks/data/usePageData";
import { requester } from "@/shared/Requester";
import { BaseProductList } from "../../baseClient";

export function NewList({
  initProducts,
  initConiditon,
}: {
  initProducts: Pageable;
  initConiditon: any;
}) {
  const { best, maxPage, page, setPage, origin, mutate } = usePageData(
    "best",
    (pageNumber) => ({
      ...initConiditon,
      pageSize: 16,
      pageNumber,
    }),
    (condition) => requester.getProducts(condition),
    (data: Pageable) => data?.totalPages || 0,
    {
      onReprocessing: (data) => data?.content || [],
      fallbackData: initProducts,
    }
  );
  return (
    <>
      <BaseProductList
        mutate={mutate}
        pageSize={origin.pageSize}
        total={origin.NumberOfTotalElements || 0}
        listArray={best}
        pagination={{ page, maxPage, setPage }}
      />
    </>
  );
}
