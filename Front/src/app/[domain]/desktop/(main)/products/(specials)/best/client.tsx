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
import styles from "./page.module.css";
import MasonryGrid from "@/components/masonry/MasonryGrid";
import ProductCard from "@/components/card/ProductCard";
import NoContent from "@/components/noContent/noContent";
import { BaseProductList, ProdcutCategory } from "../../baseClient";
import ChildCategory from "@/components/childCategory/childCategory";
import { useCategories } from "@/providers/StoreProvider/StorePorivderClient";

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

// export function CategoryFilter(category_id} : {category_id: any}) {

//   const { categoriesData } = useCategories();
//   const category = findCategoryById(categoriesData, category_id);

//   return (
//     <>
//       <ProdcutCategory />
//       <ChildCategory categoryId={category_id} childrenData={category.children} parent={category} />
//     </>
//   )
// }

export function BestList({
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
        total={origin.NumberOfTotalElements || 0}
        listArray={best}
        pagination={{ page, maxPage, setPage }}
      />
    </>
  );
}
