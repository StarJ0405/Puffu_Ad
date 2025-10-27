"use client";
import Button from "@/components/buttons/Button";
import ProductCard from "@/components/card/ProductCard";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import MasonryGrid from "@/components/masonry/MasonryGrid";
import NoContent from "@/components/noContent/noContent";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import { useCategories } from "@/providers/StoreProvider/StorePorivderClient";
import useInfiniteData from "@/shared/hooks/data/useInfiniteData";
import { requester } from "@/shared/Requester";
import useNavigate from "@/shared/hooks/useNavigate";
import clsx from "clsx";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import Pstyles from "./products.module.css";
import { useState } from "react";
import LoadingSpinner from "@/components/loading/LoadingSpinner";
import ProductLoadBtn from "@/components/buttons/ProductLoadBtn";

export function ProdcutCategoryFilter({
  ConditionOrder,
}: {
  ConditionOrder: any;
}) {
  // 대분류 카테고리

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategoryId = searchParams.get("category_id");
  const { categoriesData } = useCategories();
  const navigate = useNavigate();
  const order = ConditionOrder.order;

  // css : 카테고리 추가되어도 flex-wrap 구조 문제 없게 수정하기

  return (
    <VerticalFlex marginBottom={30} className={Pstyles.filter_box}>
      <nav className={Pstyles.cat_filter_wrap}>
        {/* ca_item에 active 클래스 주기. active 클래스만 걸리면 효과 들어감. */}
        {pathname !== "/" ? (
          <VerticalFlex
            className={clsx(
              Pstyles.ca_item,
              Pstyles.ca_all,
              !currentCategoryId && Pstyles.active
            )}
            onClick={() => navigate(`/products/${order}`)}
          >
            <FlexChild className={Pstyles.ca_thumb}>
              <P>ALL</P>
            </FlexChild>
            <Span>전체</Span>
          </VerticalFlex>
        ) : null}

        {categoriesData
          .sort((c1, c2) => c1.index - c2.index)
          .map((cat, i) => {
            const cat_check =
              pathname === `/products/${order}` &&
              currentCategoryId === String(cat.id);

            return (
              <VerticalFlex
                className={clsx(Pstyles.ca_item, cat_check && Pstyles.active)}
                key={i}
                onClick={() =>
                  navigate(`/products/${order}?category_id=${cat.id}`)
                }
              >
                <FlexChild className={Pstyles.ca_thumb}>
                  <Image src={cat.thumbnail} />
                </FlexChild>
                <Span>{cat.name}</Span>
              </VerticalFlex>
            );
          })}
      </nav>
    </VerticalFlex>
  );
}

// 인기순, 추천순, 최신순 필터
export function SortFilter({
  length,
  // sortOptions
  sortConfig,
}: {
  length: number;
  sortConfig?: {
    sort: { id: string; display: string };
    setSort: (opt: { id: string; display: string }) => void;
    sortOptions: { id: string; display: string }[];
  };
  // sortOptions: { id: string; display: string }[]
}) {
  return (
    <HorizontalFlex className={Pstyles.sort_group}>
      <FlexChild className={Pstyles.count_txt}>
        <P>
          <b>{length}</b>개의 상품
        </P>
      </FlexChild>

      <FlexChild width={"auto"}>
        {sortConfig && (
          <HorizontalFlex className={Pstyles.sort_box}>
            {sortConfig.sortOptions.map((opt) => (
              <Button
                key={opt.id}
                className={clsx(
                  Pstyles.sort_btn,
                  sortConfig.sort.id === opt.id && Pstyles.active
                )}
                onClick={() => sortConfig.setSort(opt)}
              >
                {opt.display}
              </Button>
            ))}
          </HorizontalFlex>
        )}
      </FlexChild>
    </HorizontalFlex>
  );
}

export function BaseProductList({
  // sortOptions,
  initCondition,
  id,
  initProducts,
}: {
  initCondition?: any;
  id: string;
  initProducts?: Pageable;
}) {
  const {
    [id]: products,
    Load,
    origin,
    mutate,
    page,
    maxPage,
  } = useInfiniteData(
    id,
    (pageNumber) => ({
      ...initCondition,
      pageSize: 12,
      pageNumber,
    }),
    (condition) => requester.getProducts(condition),
    (data) => data?.totalPages || 0,
    {
      onReprocessing: (data) => data?.content || [],
      fallbackData: [initProducts],
    }
  );

  const [loading, setLoading] = useState(false);

  const showMore = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await Load(); // 데이터 로드
      
    } finally {
      setLoading(false); // 끝나면 로딩 해제
    }
  }

  const pathname = usePathname();

  return (
    <>
      {products?.length > 0 ? (
        <>
          <SortFilter
            length={origin?.[origin?.length - 1]?.NumberOfTotalElements || 0}
          />
          {/* sortOptions={sortOptions} */}
          <VerticalFlex alignItems="start">
            <MasonryGrid
              width={"100%"}
              gap={20}
              breakpoints={{
                992: 5,
                768: 4,
                680: 3,
                560: 2,
              }}
            >
              {products.map((product: ProductData, i: number) => {
                return (
                  <FlexChild className={Pstyles.item_wrap} key={product.id}>
                    {
                      // 프로덕트, new일때만 나타나기. 제품 인기순 표시임
                      (pathname === "/products/new" ||
                        pathname === "/products/best") && (
                        <FlexChild
                          className={clsx(
                            Pstyles.rank,
                            i + page * 12 < 3 ? Pstyles.topRank : ""
                          )}
                        >
                          <Span className="SacheonFont">
                            {page * 12 + i + 1}
                          </Span>
                        </FlexChild>
                      )
                    }
                    <ProductCard
                      mutate={mutate}
                      product={product}
                      lineClamp={2}
                      // width={200}
                    />
                  </FlexChild>
                );
              })}
            </MasonryGrid>
          </VerticalFlex>
          {loading && <LoadingSpinner />}
          <ProductLoadBtn maxPage={maxPage} page={page} loading={loading} showMore={showMore} />
        </>
      ) : (
        <NoContent type={"상품"} />
      )}
    </>
  );
}
