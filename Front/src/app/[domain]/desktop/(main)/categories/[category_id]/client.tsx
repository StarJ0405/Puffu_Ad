"use client";
import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import { useCategories } from "@/providers/StoreProvider/StorePorivderClient";
import usePageData from "@/shared/hooks/data/usePageData";
import useNavigate from "@/shared/hooks/useNavigate";
import { requester } from "@/shared/Requester";
import clsx from "clsx";
import Link from "next/link";
import { BaseProductList } from "../../products/baseClient";
import styles from "./page.module.css";
import { useState } from "react";
import ChildCategory from "@/components/childCategory/childCategory"


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
  const navigate = useNavigate();

  

  return (
    <VerticalFlex className={styles.title_box}>
      <h3>{category?.name ?? "카테고리"}</h3>

      {/* 프로덕트 카테고리 */}
      <VerticalFlex marginBottom={30}>
        {category?.children?.length > 0 ? (
              <ChildCategory categoryId={category_id} childrenData={category.children} parent={category} />
            ) : (
              <FlexChild onClick={()=> navigate(-1)} gap={10} cursor="pointer" width={'auto'} alignSelf="start">
                <Image src={'/resources/images/back.png'} width={20} />
                <P color="#aaa">이전으로</P>
              </FlexChild>
          )
        }
      </VerticalFlex>
    </VerticalFlex>
  )
}




export function CategoryList({
  initCondition,
  initProducts,
}: {
  initCondition: any;
  initProducts: Pageable;
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
  const { categoriesData } = useCategories();
  const [sort, setSort] = useState(sortOptions[0]);
  const { categories } = usePageData(
    "categories",
    (pageNumber) => ({
      ...initCondition,
      pageSize: 24,
      pageNumber,
      order: sort?.id 
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
      <BaseProductList listArray={categories} sortConfig={{sort, setSort, sortOptions}} />
      {/* sortOptions={sortOptions} */}
    </>
  );
}


