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
import { BaseProductList } from "../../baseClient";
import useInfiniteData from "@/shared/hooks/data/useInfiniteData";


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
  id,
  initProducts,
  initConiditon,
}: {
  id: string;
  initProducts: Pageable;
  initConiditon: any;
}) {
  const {
    [id]: items,
    Load,
    page,
    maxPage,
    isLoading,
  } = useInfiniteData(
    id,
    (pageNumber) => ({
      ...initConiditon,
      pageSize: 12,
      pageNumber,
    }),
    (condition) => requester.getProducts(condition),
    (data: Pageable) => data?.totalPages || 0,
    {
      onReprocessing: (data) => data?.content || [],
      fallbackData: [initProducts],
    }
  );


  return (
    <BaseProductList
      id={id}
      initCondition={initConiditon}
      initProducts={initProducts}
      listArray={items}
      showMore={Load}
    />
  );
}

