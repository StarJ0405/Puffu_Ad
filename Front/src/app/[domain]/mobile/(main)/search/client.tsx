"use client";
import Button from "@/components/buttons/Button";
import ProductCard from "@/components/card/ProductCard";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import ListPagination from "@/components/listPagination/ListPagination";
import MasonryGrid from "@/components/masonry/MasonryGrid";
import NoContent from "@/components/noContent/noContent";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import usePageData from "@/shared/hooks/data/usePageData";
import { requester } from "@/shared/Requester";
import { log } from "@/shared/utils/Functions";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { useState } from "react";
import styles from "./page.module.css";
import { BaseProductList } from "../products/baseClient";

// export function ProdcutCategory() {
//   // 대분류 카테고리

//   const pathname = usePathname();

//   return (
//     <nav className={styles.category_wrap}>
//       {/* ca_item에 active 클래스 주기. active 클래스만 걸리면 효과 들어감. */}
//       {pathname !== "/" ? (
//         <VerticalFlex className={clsx(styles.ca_item, styles.ca_all)}>
//           <FlexChild className={styles.ca_thumb} width={120} height={120}>
//             <P>ALL</P>
//           </FlexChild>
//           <Span>전체</Span>
//         </VerticalFlex>
//       ) : null}
//       {ca_test.map((cat, i) => (
//         <VerticalFlex className={styles.ca_item} key={i}>
//           <FlexChild className={styles.ca_thumb}>
//             <Image src={cat.thumbnail} width={"auto"} height={120} />
//           </FlexChild>
//           <Span>{cat.name}</Span>
//         </VerticalFlex>
//       ))}
//     </nav>
//   );
// }

export function SecondCategory() {
  // 중분류, 소분류 카테고리

  const ca_test = [
    { name: "세척/세정" },
    { name: "관리/파우더" },
    { name: "워머/히팅" },
    { name: "드라이/건조" },
    { name: "보관/파우치" },
    { name: "오나홀 보조" },
    { name: "기타용품" },
  ];

  return (
    <>
      <ul className={styles.category_list}>
        <li className={styles.active}>
          <Span>전체</Span>
        </li>
        {ca_test.map((cat, i) => (
          <li key={i}>
            <Span>{cat.name}</Span>
          </li>
        ))}
      </ul>
    </>
  );
}

export function SearchList({
  initCondition,
  initProducts,
}: {
  initProducts: Pageable;
  initCondition: any;
}) {
  const sortOptions = [
    {
      id: "new",
      display: "최신순",
    },
    {
      id: "best",
      display: "인기순",
    },
    {
      id: "recommend",
      display: "추천순",
    },
  ];
  const [sort, setSort] = useState(sortOptions[0]);
  const {
    [initCondition?.q || "search"]: products,
    page,
    maxPage,
    setPage,
  } = usePageData(
    initCondition?.q || "search",
    (pageNumber) => ({ ...initCondition, pageNumber, order: sort?.id }),
    (condition) => requester.getProducts(condition),
    (data: Pageable) => data?.totalPages || 0,
    {
      onReprocessing: (data) => data?.content || [],
      fallbackData: initProducts,
    }
  );
  // log("검색 결과 : ", products);
  return (
    <>
      <BaseProductList
        id="base"
        listArray={products}
        sortConfig={{ sort, setSort, sortOptions }}
      />
      {/* sortOptions={sortOptions}  */}
    </>
  );
}
