import Container from "@/components/container/Container";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Pstyles from "../../products.module.css";
import { BestList } from "./client";
import styles from "./page.module.css";

import Image from "@/components/Image/Image";
import { requester } from "@/shared/Requester";
import { SearchParams } from "next/dist/server/request/search-params";

export default async function ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { category_id } = await searchParams;
  const bestCondition: any = {
    pageSize: 24,
    order: "best",
  };
  if (category_id) bestCondition.category_id = category_id;
  const bestProducts = await requester.getProducts(bestCondition);
  return (
    <section className="root page_container">
      <Container marginTop={80}>
        <VerticalFlex className={styles.titleBox}>
          <VerticalFlex className={styles.title} gap={10}>
            <Image src={"/resources/images/header/logo.png"} width={100} />
            <h2 className="SacheonFont">BEST 상품</h2>
          </VerticalFlex>
        </VerticalFlex>

        <VerticalFlex marginBottom={30}>
          {/* <CategoryFilter category_id={category_id} /> */}
        </VerticalFlex>

        <VerticalFlex className={Pstyles.list}>
          <BestList initProducts={bestProducts} initConiditon={bestCondition} />
        </VerticalFlex>
      </Container>
    </section>
  );
}
