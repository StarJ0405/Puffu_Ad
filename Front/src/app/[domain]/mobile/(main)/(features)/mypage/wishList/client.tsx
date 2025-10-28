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
  const PAGE_SIZE = 10;
  const key = "wishes";

  const {
    [key]: pageData,
    mutate,
    page: page0,
    setPage: setPage0,
    maxPage: maxPage0,
  } = usePageData(
    key,
    (pageNumber) => ({
      relations: ["product", "product.brand", "product.wishlists","product.variants"],
      pageSize: PAGE_SIZE,
      pageNumber,
    }),
    (cond) => requester.getWishlists(cond),
    (d: Pageable) => Math.max(0, Number(d?.totalPages ?? 0) - 1),
    {
      onReprocessing: (d: any) => {
        const content = Array.isArray(d) ? d : d?.content ?? [];
        const total = Number(
          (!Array.isArray(d) &&
            (d.NumberOfTotalElements ?? d.totalElements ?? d.total)) ??
            content.length
        );
        return { content, total };
      },
      fallbackData: {
        content: initWishList?.content ?? [],
        total: initWishList?.NumberOfTotalElements ?? 0,
        totalPages: initWishList?.totalPages ?? 0,
      },
      revalidateOnMount: true,
    }
    );
  
  const list = pageData?.content ?? [];
  const total = Number(pageData?.total ?? 0);

  return (
    <>
      <HorizontalFlex className={mypage.box_header}>
        <P>전체 상품 {total.toLocaleString()}</P>
      </HorizontalFlex>
      {list.length > 0 ? (
        <VerticalFlex>
          <MasonryGrid width={"100%"} gap={15} breakpoints={2}>
            {list.map((wish: WishData) => {
              const productWithWish = { ...(wish.product as any), wish };
              return (
                <ProductCard
                  key={wish.id}
                  product={productWithWish}
                  lineClamp={2}
                  width={"100%"}
                  mutate={mutate}
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
