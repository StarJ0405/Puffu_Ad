"use client";
import TestProductCard from "@/components/card/TestProductCard";
import VerticalFlex from "@/components/flex/VerticalFlex";
import MasonryGrid from "@/components/masonry/MasonryGrid";
import NoContent from "@/components/noContent/noContent";
import useData from "@/shared/hooks/data/useData";
import usePageData from "@/shared/hooks/data/usePageData";
import { requester } from "@/shared/Requester";

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
  type ListItem = {
    thumbnail: string;
    title: string;
    price: number;
    discount_rate: number;
    discount_price: number;
    heart_count: number;
    store_name: string;
    rank: number;
    id: string,
  };

  const ListProduct: ListItem[] = [
    // 임시
    {
      thumbnail: "/resources/images/dummy_img/product_01.png",
      title: "블랙 골드버스트 바디수트",
      price: 30000,
      discount_rate: 12,
      discount_price: 20000,
      heart_count: 10,
      store_name: "키테루 키테루",
      rank: 0,
      id: '콘돔',
    },
    {
      thumbnail: "/resources/images/dummy_img/product_02.png",
      title: "핑크색 일본 st 로제 베일 가벼움",
      price: 30000,
      discount_rate: 12,
      discount_price: 20000,
      heart_count: 100,
      store_name: "키테루 키테루",
      rank: 1,
      id: '콘돔',
    },
    {
      thumbnail: "/resources/images/dummy_img/product_03.png",
      title: "뒷태 반전 유혹하는 파자마",
      price: 30000,
      discount_rate: 12,
      discount_price: 20000,
      heart_count: 100,
      store_name: "키테루 키테루",
      rank: 2,
      id: '콘돔',
    },

    {
      thumbnail: "/resources/images/dummy_img/product_03.png",
      title: "뒷태 반전 유혹하는 파자마",
      price: 30000,
      discount_rate: 12,
      discount_price: 20000,
      heart_count: 100,
      store_name: "키테루 키테루",
      rank: 2,
      id: '콘돔',
    },
  ];

  return (
    <>
      {ListProduct.length > 0 ? (
        <VerticalFlex>
          <MasonryGrid width={'100%'} gap={20} breakpoints={4}>
            {ListProduct.map((product, i) => {
              return (
                <TestProductCard
                  product={wishes}
                  lineClamp={2}
                  key={i}
                  width={"100%"}
                />
              );
            })}
          </MasonryGrid>
          {/* <ProductCard 
                                      product={{
                                        id: "123",
                                        title: "테스트 상품",
                                        thumbnail: "/test.png",
                                        price: 10000,
                                        discount_price: 8000,
                                        discount_rate: 0.8,
                                        store: "테스트 스토어",
                                        brand: "브랜드명",
                                        category: "카테고리",
                                        variants: [],
                                      }}
                                      currency_unit="₩"
                                  /> */}
        </VerticalFlex>
      ) : (
        <NoContent type="상품" />
      )}
    </>
  );
}
