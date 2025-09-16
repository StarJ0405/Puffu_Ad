import Container from "@/components/container/Container";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Pstyles from "../../products.module.css";
import { BestList, CategoryFilter } from "./client";
import styles from "./page.module.css";

import Image from "@/components/Image/Image";
import { requester } from "@/shared/Requester";
import { log } from "console";

export default async function () {
  const bestCondition: any = {
    pageSize: 12,
    order: "best",
  };
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
          {/* <CategoryFilter /> */}
        </VerticalFlex>

        <VerticalFlex className={Pstyles.list}>
          <BestList
            initProducts={bestProducts}
            initConiditon={bestCondition}
          />
        </VerticalFlex>
      </Container>
    </section>
  );
}
