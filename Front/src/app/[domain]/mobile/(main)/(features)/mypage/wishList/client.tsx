"use client";
import ProductCard from "@/components/card/ProductCard";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import MasonryGrid from "@/components/masonry/MasonryGrid";
import NoContent from "@/components/noContent/noContent";
import P from "@/components/P/P";
import usePageData from "@/shared/hooks/data/usePageData";
import { requester } from "@/shared/Requester";
import mypage from "../mypage.module.css";

export function WishListTable({ initWishList }: { initWishList: Pageable }) {
  const { wishes, mutate } = usePageData(
    "wishes",
    (pageNumber) => ({ relations: ["product"], pageSize: 10, pageNumber }),
    (condition) => requester.getWishlists(condition),
    (data: Pageable) => data?.totalPages || 0,
    {
      onReprocessing: (data) => data?.content || [],
      fallbackData: initWishList,
    }
  );
  const onDeleteWishList = (wish: WishData) => {
    requester.deleteWishList(wish.id, {}, () => mutate());
  };

  return (
    <>
      <HorizontalFlex className={mypage.box_header}>
        <P>전체 상품 {wishes.length}</P>
      </HorizontalFlex>
      {wishes.length > 0 ? (
        <VerticalFlex>
          <MasonryGrid width={"100%"} gap={15} breakpoints={2}>
            {wishes.map((wish: WishData, i: number) => {
              return (
                <ProductCard
                  product={wish.product!}
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
