"use client";
import VerticalFlex from "@/components/flex/VerticalFlex";
import { useCategories } from "@/providers/StoreProvider/StorePorivderClient";
import usePageData from "@/shared/hooks/data/usePageData";
import { requester } from "@/shared/Requester";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BaseProductList } from "../../products/baseClient";
import Pstyles from "../../products/products.module.css";
import style from "./page.module.css"
import clsx from "clsx";

function findCategoryById(categories: any[], id: string): any | undefined {
  for (const cat of categories) {
    if (cat.id === id) {
      return cat; // 현재 레벨에서 찾음
    }
    if (cat.children && cat.children.length > 0) {
      const found = findCategoryById(cat.children, id);
      if (found) return found; // 자식 트리에서 찾음
    }
  }
  return undefined;
}

export function TitleBox({category_id}: {category_id: any}) {

  const { categoriesData } = useCategories();
  const category = findCategoryById(categoriesData, category_id);

  return (
    <VerticalFlex className={Pstyles.titleBox} alignItems="start">
      <VerticalFlex className={clsx(style.title)} width={'auto'}>
        <h2 className="Wanted">{category.name}</h2>
      </VerticalFlex>

      <CategoryMenu categories={categoriesData} />
    </VerticalFlex>
  )
}


export function CategoryMenu({categories}: {categories: any}) {

  const pathname = usePathname();
  const catArray = 
    categories.sort((c1: CategoryData, c2: CategoryData) => c1.index - c2.index);

  return (
    <nav className={Pstyles.page_list}>
      {catArray.map((item: CategoryData, i: number) => {
        const active = pathname.includes(item.id) ? Pstyles.active : "";

        return (
          <Link key={i} href={`/categories/${item.id}`} className={active}>
            {item.name}
          </Link>
        );
      })}
    </nav>
  )
}

export function CategoryList({
  initCondition,
  initProducts,
}: {
  initCondition: any;
  initProducts: Pageable;
}) {
  // const sortOptions = [
  //   {
  //     id: "new",
  //     display: "최신순",
  //   },
  //   {
  //     id: "best",
  //     display: "인기순",
  //   },
  //   {
  //     id: "recommend",
  //     display: "추천순",
  //   },
  // ];
  // const [sort, setSort] = useState(sortOptions[0]);
  const { categories, origin, mutate, page, maxPage, setPage } = usePageData(
    "categories",
    (pageNumber) => ({
      ...initCondition,
      pageSize: 16,
      pageNumber,
      // order: sort?.id,
    }),
    (condition) => requester.getProducts(condition),
    (data: Pageable) => data?.totalPages || 0,
    {
      onReprocessing: (data) => data?.content || [],
      fallbackData: initProducts,
    }
  );
  // log(categories);
  return (
    <>
      <BaseProductList
        pageSize={maxPage}
        mutate={mutate}
        // pageSize={origin?.pageSize}
        total={origin?.NumberOfTotalElements || 0}
        listArray={categories}
        // sortConfig={{ sort, setSort, sortOptions }}
        pagination={{ page, maxPage, setPage }}
      />
      {/* sortOptions={sortOptions} */}
    </>
  );
}
