"use client";
import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import usePageData from "@/shared/hooks/data/usePageData";
import { requester } from "@/shared/Requester";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import Pstyles from "../../products.module.css";
import MasonryGrid from "@/components/masonry/MasonryGrid";
import ProductCard from "@/components/card/ProductCard";
import NoContent from "@/components/noContent/noContent";
import {BaseProductList} from "../../baseClient";


export function SecondCategory() {
  // 카테고리메뉴

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
      <ul className={Pstyles.category_list}>
        <li className={Pstyles.active}>
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

export function BestList({
  initProducts,
  initConiditon,
}: {
  initProducts: Pageable;
  initConiditon: any;
}) {
  const { best, maxPage, page, setPage, mutate } = usePageData(
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
      <BaseProductList listArray={best} />
    </>
  );
}
