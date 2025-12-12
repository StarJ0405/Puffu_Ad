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
import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/loading/LoadingSpinner";
import ProductLoadBtn from "@/components/buttons/ProductLoadBtn";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import siteInfo from "@/shared/siteInfo";
import ModalBase from "@/modals/ModalBase";

export function ProductMenu() {
  const pathname = usePathname();

  const menu = [
    { name: "best 상품", link: siteInfo.pt_best },
    { name: "신상품", link: siteInfo.pt_new },
    { name: "세일 상품", link: siteInfo.pt_sale },
    { name: "입고 예정", link: siteInfo.pt_commingSoon },
  ];

  return (
    <nav className={Pstyles.page_list}>
      {menu.map((item, i) => {
        const active = pathname === item.link ? Pstyles.active : "";

        return (
          <Link key={i} href={item.link} className={active}>
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}


// 카테고리 메뉴
export function CategoryMenu({ ConditionOrder }: { ConditionOrder: any }) {
  const { categoriesData } = useCategories();
  const order = ConditionOrder.order;

  const searchParams = useSearchParams();
  const currentCategoryId = searchParams.get("category_id");
  const [caTag, setCaTag] = useState("카테고리 선택");

  useEffect(() => {
    if (!categoriesData) return;

    const categoryFromUrl = categoriesData.find(
      (cat: any) => String(cat.id) === currentCategoryId
    );

    if (categoryFromUrl) {
      setCaTag(categoryFromUrl.name);
    } else {
      setCaTag("카테고리 선택");
    }
  }, [currentCategoryId, categoriesData]);

  return (
    <FlexChild
      className={Pstyles.category_select}
      onClick={() =>
        NiceModal.show(CategoryModal, { categoriesData, order, setCaTag, currentCategoryId })
      }
    >
      <P>{caTag}</P>
      <Image
        src={"/resources/icons/arrow/board_arrow_bottom_icon.png"}
        width={12}
      />
    </FlexChild>
  );
}

// 카테고리 메뉴(=> 모달)
const CategoryModal = NiceModal.create(
  ({
    categoriesData,
    order,
    setCaTag,
    currentCategoryId,
  }: {
    categoriesData: any;
    order: any;
    setCaTag: React.Dispatch<React.SetStateAction<string>>;
    currentCategoryId: string | null;
  }) => {
    const pathname = usePathname();
    const navigate = useNavigate();
    const modal = useModal();

    // 세일 전용
    const orderCheck = order == 'discount' ? 'hot' : order;

    const orderState = (cat: any)=> {
      navigate(`/products/${orderCheck}?category_id=${cat.id}`);
      modal.remove();
      setCaTag(cat.name);
    }

    return (
      <ModalBase
        withHeader
        headerStyle={{
          backgroundColor: "#fff",
          borderBottom: "none",
          color: "#000",
        }}
        borderRadius={10}
        width={"90%"}
        maxWidth={450}
        height={"90lvh"}
        maxHeight={660}
        title={"카테고리 선택"}
        // onClose={() => {
        //   onCancel?.();
        //   modal.remove();
        // }}
        backgroundColor={"#fff"}
        clickOutsideToClose
      >
        <nav className={Pstyles.category_menu}>
          {pathname !== "/" ? (
            <VerticalFlex
              className={clsx(
                Pstyles.ca_item,
                Pstyles.ca_all,
                !currentCategoryId && Pstyles.active
              )}
              onClick={() => {
                navigate(`/products/${orderCheck}`);
                modal.remove();
                setCaTag('카테고리 선택');
              }}
            >
              <FlexChild className={Pstyles.ca_img}>
                <P>ALL</P>
              </FlexChild>
              <Span>전체</Span>
            </VerticalFlex>
          ) : null}

          {categoriesData
            .sort((c1: CategoryData, c2: CategoryData) => c1.index - c2.index)
            .map((cat: CategoryData, i: number) => {
              const cat_check =
                pathname === `/products/${orderCheck}` &&
                currentCategoryId === String(cat.id);

              return (
                <VerticalFlex
                  className={clsx(Pstyles.ca_item, cat_check && Pstyles.active)}
                  justifyContent="start"
                  key={i}
                  onClick={() =>
                    orderState(cat)
                  }
                >
                  <FlexChild className={Pstyles.ca_img}>
                    <Image src={cat.thumbnail} />
                  </FlexChild>
                  <VerticalFlex className={Pstyles.text_box}>
                    <h5>{cat.name}</h5>
                    <Span className="Wanted">{cat.english_name}</Span>
                  </VerticalFlex>
                </VerticalFlex>
              );
            })}
        </nav>
      </ModalBase>
    );
  }
);

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
      // pageSize: 12,
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
  };
  // const pageSize = initCondition.pageSize;
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
              gap={16}
              breakpoints={{
                992: 5,
                768: 4,
                680: 3,
                560: 2,
              }}
            >
              {products.map((product: ProductData, i: number) => {
                return (
                  <FlexChild className={'card_wrap'} key={product.id}>
                    {
                      // 프로덕트, new일때만 나타나기. 제품 인기순 표시임
                      (pathname === "/products/new" ||
                        pathname === "/products/best") && (
                        <FlexChild className={'rank'}>
                          <Span>
                            {i + 1}
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
          <ProductLoadBtn
            maxPage={maxPage}
            page={page}
            loading={loading}
            showMore={showMore}
          />
        </>
      ) : (
        <NoContent type={"상품"} />
      )}
    </>
  );
}
