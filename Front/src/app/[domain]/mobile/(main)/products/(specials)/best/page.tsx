import Container from "@/components/container/Container";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Pstyles from "../../products.module.css";
import styles from "./page.module.css";

import Image from "@/components/Image/Image";
import { requester } from "@/shared/Requester";
import { BaseProductList, ProdcutCategoryFilter } from "../../baseClient";
import { SearchParams } from "next/dist/server/request/search-params";


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


export default async function ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { category_id } = await searchParams;
  const bestCondition: any = { pageSize: 12, pageNumber: 0, order: "best" };
  if (category_id) bestCondition.category_id = category_id;
  const bestProducts = await requester.getProducts(bestCondition);
  return (
    <section className="root page_container">
      <Container marginTop={35}>
        <VerticalFlex className={styles.titleBox}>
          <VerticalFlex className={styles.title} gap={10}>
            <Image src={"/resources/images/header/logo.png"} width={70} />
            <h2 className="SacheonFont">BEST 상품</h2>
          </VerticalFlex>
        </VerticalFlex>

        <ProdcutCategoryFilter ConditionOrder={bestCondition}  />

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
