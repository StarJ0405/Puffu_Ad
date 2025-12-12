import Container from "@/components/container/Container";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Span from "@/components/span/Span";
import { requester } from "@/shared/Requester";
import { SearchParams } from "next/dist/server/request/search-params";
import Pstyles from "../../products.module.css";
import { NewList } from "./client";
import { CategoryMenu, ProductMenu } from "../../baseClient";
import FlexChild from "@/components/flex/FlexChild";

export default async function ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { category_id } = await searchParams;
  const newCondition: any = {
    pageSize: 24,
    order: "new",
    product_type: "exclude_set",
    warehousing: false,
  };
  if (category_id) newCondition.category_id = category_id;

  const newProducts = await requester.getProducts(newCondition);

  return (
    <section className="root page_container">
      <Container marginTop={80}>
        <VerticalFlex className={Pstyles.titleBox} alignItems="start">
          <VerticalFlex className={Pstyles.title} gap={10} width={'auto'}>
            <h2 className="Wanted">신상품</h2>
          </VerticalFlex>

          <ProductMenu />
        </VerticalFlex>

        <FlexChild className={Pstyles.container} alignItems="start" gap={40}>
          <CategoryMenu ConditionOrder={newCondition} />
  
          <VerticalFlex className={Pstyles.list_wrap}>
            <NewList initProducts={newProducts} initConiditon={newCondition} />
            {/* <BaseProductList
              id={'new'} 
              initProducts={newProducts} 
              initConiditon={newCondition} 
            /> */}
          </VerticalFlex>
        </FlexChild>
      </Container>
    </section>
  );
}
