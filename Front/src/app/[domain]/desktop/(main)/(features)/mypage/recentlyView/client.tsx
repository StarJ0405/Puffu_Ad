"use client";
import ProductCard from "@/components/card/ProductCard";
import MasonryGrid from "@/components/masonry/MasonryGrid";
import NoContent from "@/components/noContent/noContent";
import useData from "@/shared/hooks/data/useData";
import { requester } from "@/shared/Requester";
import { Storage } from "@/shared/utils/Data";
import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import P from "@/components/P/P";
import mypage from '../mypage.module.css';
import HorizontalFlex from "@/components/flex/HorizontalFlex";

export function RecentlyViewTable() {
  type ListItem = {
    thumbnail: string;
    title: string;
    price: number;
    discount_rate: number;
    discount_price: number;
    heart_count: number;
    store_name: string;
    rank: number;
    id: string;
  };
  const { recents, mutate } = useData(
    "recents",
    {},
    (condition) => {
      const item = localStorage.getItem(Storage.RECENTS);
      if (item) {
        const ids = JSON.parse(item) || [];
        condition.ids = ids;
      } else condition.ids = ["", ""];
      return requester.getProducts(condition);
    },
    { onReprocessing: (data) => data?.content || [] }
  );
  

  return (
    <>
      <HorizontalFlex className={mypage.box_header}>
         <P>최근 본 상품</P>
         <FlexChild className={mypage.header_subTitle}>
            <P>전체 상품 {recents.length}</P>
         </FlexChild>
      </HorizontalFlex>
      {recents.length > 0 ? (
        <VerticalFlex>
          <MasonryGrid width={'100%'} gap={15} breakpoints={5}>
            {recents.map((product: ProductData, i: number) => {
              return (
                <ProductCard
                  product={product}
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
