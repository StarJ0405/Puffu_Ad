import Container from "@/components/container/Container";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Pstyles from "../../products.module.css";
import styles from "./page.module.css";

import Image from "@/components/Image/Image";
import { requester } from "@/shared/Requester";
import { BaseProductList, CategoryMenu, ProductMenu } from "../../baseClient";
import { SearchParams } from "next/dist/server/request/search-params";

// function findCategoryById(categories: any[], id: string): any | undefined {
//   for (const cat of categories) {
//     if (cat.id === id) {
//       return cat; // 현재 레벨에서 찾음
//     }
//     if (cat.children && cat.children.length > 0) {
//       const found = findCategoryById(cat.children, id);
//       if (found) return found; // 자식 트리에서 찾음
//     }
//   }
//   return undefined;
// }

export default async function ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { category_id } = await searchParams;
  const bestCondition: any = {
    pageSize: 6,
    pageNumber: 0,
    order: "best",
    product_type: "exclude_set",
    warehousing: false,
  };
  if (category_id) bestCondition.category_id = category_id;
  const bestProducts = await requester.getProducts(bestCondition);
  return (
    <section className="mob_root mob_page_container">
      <Container marginTop={40}>

        <VerticalFlex className={Pstyles.titleBox} alignItems="start" justifyContent="start">
          <ProductMenu />
        </VerticalFlex>

        <CategoryMenu ConditionOrder={bestCondition} />

        <VerticalFlex className={Pstyles.list}>
          <BaseProductList
            id={"best"}
            initProducts={bestProducts}
            initCondition={bestCondition}
          />
        </VerticalFlex>
      </Container>
    </section>
  );
}
