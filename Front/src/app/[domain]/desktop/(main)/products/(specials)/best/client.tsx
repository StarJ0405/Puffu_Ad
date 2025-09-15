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
import styles from "./page.module.css"
import MasonryGrid from "@/components/masonry/MasonryGrid";
import TestProductCard from "@/components/card/TestProductCard";
import NoContent from "@/components/noContent/noContent";
import {BaseProductList} from "../../baseClient";
import Link from "next/link";




// 중분류, 소분류 카테고리
export function SecondCategory(
  { childrenData, parent, categoryId } :
  {
    childrenData: CategoryData[]; 
    parent: CategoryData;
    categoryId: any;
  }
) {

  return (
    <>
      <ul className={styles.category_list}>
        <li className={clsx(parent.id === categoryId && styles.active)}>
          <Link href={`/categories/${parent.id}`}>
            <Span>전체</Span>
          </Link>
        </li>
        {childrenData.map((child, i) => (
          <li key={i}>
            <Link href={`/categories/${child.id}`}>
              <Span>{child.name}</Span>
            </Link>
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
