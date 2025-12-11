"use client";
import usePageData from "@/shared/hooks/data/usePageData";
import { requester } from "@/shared/Requester";
import { BaseProductList } from "../../baseClient";


// export function HotList({
//   initProducts,
//   initConiditon,
// }: {
//   initProducts: Pageable;
//   initConiditon: any;
// }) {
//   const { discount, maxPage, page, setPage, mutate, origin } = usePageData(
//     "discount",
//     (pageNumber) => ({
//       ...initConiditon,
//       pageSize: 24,
//       pageNumber,
//     }),
//     (condition) => requester.getProducts(condition),
//     (data: Pageable) => data?.totalPages || 0,
//     {
//       onReprocessing: (data) => data?.content || [],
//       fallbackData: initProducts,
//     }
//   );
//   return (
//     <>
//       <BaseProductList
//         mutate={mutate}
//         total={origin.NumberOfTotalElements || 0}
//         listArray={discount}
//         pagination={{ page, maxPage, setPage }}
//       />
//     </>
//   );
// }
