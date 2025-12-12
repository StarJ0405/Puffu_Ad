import Container from "@/components/container/Container";
import VerticalFlex from "@/components/flex/VerticalFlex";
import { requester } from "@/shared/Requester";
import { SearchParams } from "next/dist/server/request/search-params";
import { BaseProductList, ProductMenu, CategoryMenu } from "../../baseClient";
import Pstyles from "../../products.module.css";

export default async function ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { category_id } = await searchParams;
  const newCondition: any = {
    pageSize: 24,
    order: "commingSoon",
    warehousing: true,
  };
  if (category_id) newCondition.category_id = category_id;
  const newProducts = await requester.getProducts(newCondition);

  return (
    <section className="mob_root mob_page_container">
      <Container marginTop={40}>
        <VerticalFlex className={Pstyles.titleBox} alignItems="start" justifyContent="start">
          <ProductMenu />
        </VerticalFlex>

        <CategoryMenu ConditionOrder={newCondition} />

        <VerticalFlex className={Pstyles.list}>
          <BaseProductList
            id="commingSoon"
            initProducts={newProducts}
            initCondition={newCondition}
          />
        </VerticalFlex>
      </Container>
    </section>
  );
}
