import Container from "@/components/container/Container";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Pstyles from "../../products.module.css";
import { CategoryMenu, ProductMenu } from "../../baseClient";
import { BestList } from './client'
import styles from "./page.module.css";
import Image from "@/components/Image/Image";
import { requester } from "@/shared/Requester";
import { SearchParams } from "next/dist/server/request/search-params";
import Link from "next/link";
import FlexChild from "@/components/flex/FlexChild";

export default async function ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { category_id } = await searchParams;
  const bestCondition: any = {
    pageSize: 16,
    order: "best",
    product_type: "exclude_set",
    warehousing: false,
  };

  if (category_id) bestCondition.category_id = category_id;
  const bestProducts = await requester.getProducts(bestCondition);

  // console.log(bestProducts);

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
          <CategoryMenu ConditionOrder={bestCondition} />
  
          <VerticalFlex className={Pstyles.list_wrap}>
            <BestList initProducts={bestProducts} initConiditon={bestCondition} />
            {/* <BaseProductList
              id={'best'}
              initProducts={bestProducts}
              initConiditon={bestCondition}
            /> */}
          </VerticalFlex>
        </FlexChild>
      </Container>
    </section>
  );
}
