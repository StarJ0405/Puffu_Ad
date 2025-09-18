"use client";
import Button from "@/components/buttons/Button";
import ProductCard from "@/components/card/ProductCard";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import ListPagination from "@/components/listPagination/ListPagination";
import MasonryGrid from "@/components/masonry/MasonryGrid";
import NoContent from "@/components/noContent/noContent";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import Pstyles from "./products.module.css";
import { useCategories } from "@/providers/StoreProvider/StorePorivderClient";
import Link from "next/link";

export function ProdcutCategory() {
  // 대분류 카테고리

  const pathname = usePathname();
  const { categoriesData } = useCategories();

  // css : 카테고리 추가되어도 flex-wrap 구조 문제 없게 수정하기

  return (
    <nav className={Pstyles.category_wrap}>
      {/* ca_item에 active 클래스 주기. active 클래스만 걸리면 효과 들어감. */}
      {pathname !== "/" ? (
        <VerticalFlex className={clsx(Pstyles.ca_item, Pstyles.ca_all)}>
          <FlexChild className={Pstyles.ca_thumb} width={120} height={120}>
            <P>ALL</P>
          </FlexChild>
          <Span>전체</Span>
        </VerticalFlex>
      ) : null}

      {categoriesData
        .sort((c1, c2) => c1.index - c2.index)
        .map((cat, i) => (
          <VerticalFlex className={Pstyles.ca_item} key={i}>
            <Link href={`/categories/${cat.id}`}>
              <FlexChild className={Pstyles.ca_thumb}>
                <Image src={cat.thumbnail} width={"auto"} height={120} />
              </FlexChild>
            </Link>
            <Span>{cat.name}</Span>
          </VerticalFlex>
        ))}
    </nav>
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
  mutate,
  total,
  listArray,
  // sortOptions,
  sortConfig,
  commingSoon, // 입고예정 임시용
  pagination,
}: {
  mutate?: () => void;
  total?: number;
  listArray: ProductData[];
  // sortOptions: { id: string; display: string }[];
  sortConfig?: {
    sort: { id: string; display: string };
    setSort: (opt: { id: string; display: string }) => void;
    sortOptions: { id: string; display: string }[];
  };
  commingSoon?: boolean;
  pagination?: { page: number; maxPage: number; setPage: (p: number) => void };
}) {
  // const [sort, setSort] = useState(sortOptions?.[0]); // 정렬 상태 관리
  const listLength = listArray.length;

  return (
    <>
      {listLength > 0 ? (
        <>
          <SortFilter length={total || listLength} sortConfig={sortConfig} />
          {/* sortOptions={sortOptions} */}
          <VerticalFlex alignItems="start">
            <MasonryGrid gap={20} width={"100%"}>
              {listArray.map((product: ProductData, i) => {
                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    commingSoon={commingSoon}
                    lineClamp={2}
                    width={200}
                    mutate={mutate}
                  />
                );
              })}
            </MasonryGrid>
          </VerticalFlex>
          {pagination && pagination.maxPage > 0 && (
            <ListPagination
              page={pagination.page}
              maxPage={pagination.maxPage}
              onChange={pagination.setPage}
            />
          )}
        </>
      ) : (
        <NoContent type={"상품"} />
      )}
    </>
  );
}
