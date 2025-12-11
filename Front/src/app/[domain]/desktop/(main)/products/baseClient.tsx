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
import { useCategories } from "@/providers/StoreProvider/StorePorivderClient";
import useNavigate from "@/shared/hooks/useNavigate";
import clsx from "clsx";
import { usePathname, useSearchParams } from "next/navigation";
import Pstyles from "./products.module.css";
import Link from "next/link";
import siteInfo from "@/shared/siteInfo";
import { requester } from "@/shared/Requester";
import usePageData from "@/shared/hooks/data/usePageData";


export function ProductMenu() {

  const pathname = usePathname();

  const menu = [
    {name: 'best 상품', link: siteInfo.pt_best},
    {name: '신상품', link: siteInfo.pt_new},
    {name: '세일 상품', link: siteInfo.pt_sale},
    {name: '입고 예정', link: siteInfo.pt_commingSoon},
  ]

  return (
    <nav className={Pstyles.page_list}>
      {menu.map((item, i)=> {

          const active = pathname === item.link ? Pstyles.active : '';

          return (
            <Link key={i} href={item.link} className={active}>{item.name}</Link>
          )
        })
      }
    </nav>
  )
}

export function CategoryMenu({
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

  return (
    <nav className={Pstyles.category_menu}>
      <HorizontalFlex className={Pstyles.title}>
        <h3 className="Wanted">CATEGORY</h3>

        <Button onClick={()=> navigate(`/products/${order}`)} className={Pstyles.reset_btn}>초기화</Button>
      </HorizontalFlex>
     
      <VerticalFlex className={Pstyles.ca_list} alignItems="start">
        {categoriesData
          .sort((c1, c2) => c1.index - c2.index)
          .map((cat, i) => {
            const cat_check =
              pathname === `/products/${order}` &&
              currentCategoryId === String(cat.id);
  
            return (
              <HorizontalFlex
                className={clsx(Pstyles.ca_item, cat_check && Pstyles.active)}
                key={i}
                onClick={() =>
                  navigate(`/products/${order}?category_id=${cat.id}`)
                }
              >
                <P>{cat.name}</P>

                <Image src={'/resources/icons/arrow_right.png'} width={7} />
              </HorizontalFlex>
            );
          })}
      </VerticalFlex>
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
  id,
  sortConfig,
  // pagination,
  initProducts,
  initConiditon,
}: {
  id: string,
  initProducts?: Pageable;
  initConiditon?: any;
  // pagination?: { page: number; maxPage: number; setPage: (p: number) => void };
  sortConfig?: {
    sort: { id: string; display: string };
    setSort: (opt: { id: string; display: string }) => void;
    sortOptions: { id: string; display: string }[];
  };
}) {

  const { [id]: products, maxPage, page, setPage, mutate, origin } = usePageData(
    id,
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

  // const [sort, setSort] = useState(sortOptions?.[0]); // 정렬 상태 관리

  const pathname = usePathname();

  const breakPoint = {
    default: 4,
    1300: 3,
    1024: 3,
  }

  return (
    <>
      {products?.length > 0 ? (
        <>
          <SortFilter length={products?.length} sortConfig={sortConfig} />
          {/* sortOptions={sortOptions} */}
          <VerticalFlex alignItems="start">
            <MasonryGrid gap={20} width={"100%"} breakpoints={breakPoint}>
              {products?.map((product: ProductData, i:number) => {
                return (
                  <FlexChild key={product.id} className={Pstyles.card_wrap}>
                    {
                      // 프로덕트, new일때만 나타나기. 제품 인기순 표시임
                      (pathname === "/products/new" ||
                        pathname === "/products/best") && (
                        <FlexChild className={clsx(Pstyles.rank)}>
                          <Span>
                            {(page || 0) * 24 + i + 1}
                          </Span>
                        </FlexChild>
                      )
                    }
                    <ProductCard
                      product={product}
                      lineClamp={2}
                      width={"100%"}
                      mutate={mutate}
                    />
                  </FlexChild>
                );
              })}
            </MasonryGrid>
          </VerticalFlex>
          {products?.lenght < 0 && (
            <ListPagination
              page={page}
              maxPage={maxPage}
              onChange={setPage}
            />
          )}
        </>
      ) : (
        <NoContent type={"상품"} />
      )}
    </>
  );
}

// export function BaseProductList({
//   id,
//   mutate,
//   total,
//   listArray,
//   // sortOptions,
//   sortConfig,
//   pagination,
// }: {
//   id: string,
//   mutate?: () => void;
//   total?: number;
//   listArray: ProductData[];
//   // sortOptions: { id: string; display: string }[];
//   sortConfig?: {
//     sort: { id: string; display: string };
//     setSort: (opt: { id: string; display: string }) => void;
//     sortOptions: { id: string; display: string }[];
//   };
//   pagination?: { page: number; maxPage: number; setPage: (p: number) => void };
// }) {
//   // const [sort, setSort] = useState(sortOptions?.[0]); // 정렬 상태 관리
//   const listLength = listArray.length;

//   const pathname = usePathname();

//   const breakPoint = {
//     default: 4,
//     1300: 3,
//     1024: 3,
//   }

//   return (
//     <>
//       {listLength > 0 ? (
//         <>
//           <SortFilter length={total || listLength} sortConfig={sortConfig} />
//           {/* sortOptions={sortOptions} */}
//           <VerticalFlex alignItems="start">
//             <MasonryGrid gap={20} width={"100%"} breakpoints={breakPoint}>
//               {listArray.map((product: ProductData, i:number) => {
//                 return (
//                   <FlexChild key={product.id} className={Pstyles.card_wrap}>
//                     {
//                       // 프로덕트, new일때만 나타나기. 제품 인기순 표시임
//                       (pathname === "/products/new" ||
//                         pathname === "/products/best") && (
//                         <FlexChild className={clsx(Pstyles.rank)}>
//                           <Span>
//                             {(pagination?.page || 0) * 24 + i + 1}
//                           </Span>
//                         </FlexChild>
//                       )
//                     }
//                     <ProductCard
//                       product={product}
//                       lineClamp={2}
//                       width={"100%"}
//                       mutate={mutate}
//                     />
//                   </FlexChild>
//                 );
//               })}
//             </MasonryGrid>
//           </VerticalFlex>
//           {pagination && (
//             <ListPagination
//               page={pagination.page}
//               maxPage={pagination.maxPage}
//               onChange={pagination.setPage}
//             />
//           )}
//         </>
//       ) : (
//         <NoContent type={"상품"} />
//       )}
//     </>
//   );
// }
