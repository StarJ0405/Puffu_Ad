"use client";
import ProductCard from "@/components/card/ProductCard";
import VerticalFlex from "@/components/flex/VerticalFlex";
import MasonryGrid from "@/components/masonry/MasonryGrid";
import NoContent from "@/components/noContent/noContent";
import useData from "@/shared/hooks/data/useData";
import usePageData from "@/shared/hooks/data/usePageData";
import { requester } from "@/shared/Requester";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import FlexChild from "@/components/flex/FlexChild";
import P from "@/components/P/P";
import mypage from "../mypage.module.css";
import { useEffect } from "react";

export function WishListTable({ initWishList }: { initWishList: Pageable }) {
  const { wishes, page, setPage, maxPage } = usePageData(
    "wishes",
    (pageNumber) => ({ relations: ["product"], pageSize: 10, pageNumber }),
    (condition) => requester.getWishlists(condition),
    (data: Pageable) => data?.totalPages || 0,
    {
      onReprocessing: (data) => data?.content || [],
      fallbackData: initWishList,
    }
  );

  return (
    <>
      <HorizontalFlex className={mypage.box_header}>
        <P>관심 리스트</P>
        <FlexChild className={mypage.header_subTitle}>
          <P>전체 상품 {wishes.length}</P>
        </FlexChild>
      </HorizontalFlex>
      {wishes.length > 0 ? (
        <VerticalFlex>
          <MasonryGrid width={'100%'} gap={15} breakpoints={2}>
            {wishes.map((product: WishData, i: number) => {
              return (
                <ProductCard
                  product={product.product!}
                  lineClamp={2}
                  key={i}
                  width={"100%"}
                />
              );
            })}
          </MasonryGrid>
        </VerticalFlex>
      ) : (
        <NoContent type="상품" />
      )}
    </>
  );
}
