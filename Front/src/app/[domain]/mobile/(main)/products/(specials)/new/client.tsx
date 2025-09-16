"use client"
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import Pstyles from "../../products.module.css";
import usePageData from "@/shared/hooks/data/usePageData";
import { requester } from "@/shared/Requester";
import { BaseProductList } from "../../baseClient";
import useInfiniteData from "@/shared/hooks/data/useInfiniteData";



export function NewList({
  id,
  initProducts,
  initConiditon,
}: {
  id: string,
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
    <>
      <BaseProductList
        id={id}
        initCondition={initConiditon}
        initProducts={initProducts}
        listArray={items}
        showMore={Load}
      />
    </>
  );
}