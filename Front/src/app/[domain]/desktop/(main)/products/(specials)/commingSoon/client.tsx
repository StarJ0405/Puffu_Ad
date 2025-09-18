"use client";
import usePageData from "@/shared/hooks/data/usePageData";
import { requester } from "@/shared/Requester";
import { BaseProductList } from "../../baseClient";

export function CommingSoonList({
  initProducts,
  initConiditon,
}: {
  initProducts: Pageable;
  initConiditon: any;
}) {
  const { best, maxPage, page, setPage, mutate, origin } = usePageData(
    "best",
    (pageNumber) => ({
      ...initConiditon,
      pageSize: 24,
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
        total={origin.NumberOfTotalElements || 0}
        listArray={best}
        commingSoon={true}
        pagination={{ page, maxPage, setPage }}
      />
    </>
  );
}
