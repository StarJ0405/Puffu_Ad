import Container from "@/components/container/Container";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import { requester } from "@/shared/Requester";
import { BaseProductList, ProductMenu, CategoryMenu } from "../../baseClient";
import Pstyles from "../../products.module.css";
import styles from "./page.module.css";
import { SearchParams } from "next/dist/server/request/search-params";

export default async function ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { category_id } = await searchParams;
  const hotCondition: any = {
    pageSize: 12,
    pageNumber: 0,
    order: "discount",
    product_type: "exclude_set",
    warehousing: false,
  };
  if (category_id) hotCondition.category_id = category_id;
  const hotProducts = await requester.getProducts(hotCondition);

  return (
    <section className="mob_root mob_page_container">
      <Container marginTop={40}>
        <VerticalFlex className={Pstyles.titleBox} alignItems="start" justifyContent="start">
          <ProductMenu />
        </VerticalFlex>

        <CategoryMenu ConditionOrder={hotCondition} />

        <VerticalFlex className={Pstyles.list}>
          <BaseProductList
            id={"discount"}
            initProducts={hotProducts}
            initCondition={hotCondition}
          />
        </VerticalFlex>
      </Container>
    </section>
  );
}
