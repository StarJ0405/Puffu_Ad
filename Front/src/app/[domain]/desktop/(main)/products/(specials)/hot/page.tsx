import Container from "@/components/container/Container";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import { HotList } from "./client";
import Pstyles from "../../products.module.css";
import {} from "./client";
import { CategoryMenu, ProductMenu } from "../../baseClient";
import { requester } from "@/shared/Requester";
// import { HotList } from "./client";
import { SearchParams } from "next/dist/server/request/search-params";
import FlexChild from "@/components/flex/FlexChild";

export default async function ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { category_id } = await searchParams;
  const hotCondition: any = {
    pageSize: 24,
    order: "discount",
    product_type: "exclude_set",
    warehousing: false,
  };
  if (category_id) hotCondition.category_id = category_id;
  const hotProducts = await requester.getProducts(hotCondition);

  return (
    <section className="root page_container">
      <Container marginTop={80}>
        <VerticalFlex className={Pstyles.titleBox} alignItems="start">
          <VerticalFlex className={Pstyles.title} gap={10} width={'auto'}>
            <h2 className="Wanted">BEST <small>상품</small></h2>
          </VerticalFlex>

          <ProductMenu />
        </VerticalFlex>

        <FlexChild className={Pstyles.container} alignItems="start" gap={40}>
          <CategoryMenu ConditionOrder={hotCondition} />
  
          <VerticalFlex className={Pstyles.list_wrap}>
            <HotList initProducts={hotProducts} initConiditon={hotCondition} />
            {/* <BaseProductList
              id={'discount'}
              initProducts={hotProducts}
              initConiditon={hotCondition}
            /> */}
          </VerticalFlex>
        </FlexChild>
      </Container>
    </section>
  );
}
