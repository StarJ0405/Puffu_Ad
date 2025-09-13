"use client";
import Button from "@/components/buttons/Button";
import TestProductCard from "@/components/card/TestProductCard";
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
import clsx from "clsx";
import { usePathname } from "next/navigation";
import styles from "./page.module.css";
import { log } from "@/shared/utils/Functions";
import { useCategories } from "@/providers/StoreProvider/StorePorivderClient";
import {SortFilter, BaseProductList} from "../../products/baseClient";


function findCategoryById(categories: any[], id: string): any | undefined {
  for (const cat of categories) {
    if (cat.id === id) {
      return cat; // 현재 레벨에서 찾음
    }
    if (cat.children && cat.children.length > 0) {
      const found = findCategoryById(cat.children, id);
      if (found) return found; // 자식 트리에서 찾음
    }
  }
  return undefined;
}


export function TitleBox({category_id} : {category_id: any}) {

  const { categoriesData } = useCategories();
  const category = findCategoryById(categoriesData, category_id);

  return (
    <VerticalFlex className={styles.title_box}>
      <h3>{category?.name ?? "카테고리"}</h3>

      {/* 프로덕트 카테고리 */}
      <VerticalFlex marginBottom={30}>
        {/* <SecondCategory /> 중분류 있을때, 중분류 안에 소분류 있을때만 나오기. */}
      </VerticalFlex>
    </VerticalFlex>
  )
}


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

export function CategoryList({
  initCondition,
  initProducts,
}: {
  initCondition: any;
  initProducts: Pageable;
}) {
  const { categoriesData } = useCategories();
  const { categories } = usePageData(
    "categories",
    (pageNumber) => ({
      ...initCondition,
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
  // log(categories);
  return (
    <>
      <BaseProductList listArray={categories} />
    </>
  );
}


