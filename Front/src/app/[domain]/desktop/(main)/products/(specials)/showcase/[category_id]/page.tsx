// src/app/.../products/showcase/[category_id]/page.tsx

import Container from "@/components/container/Container";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Pstyles from "../../../products.module.css";
import { BestList, CategoryTab, ReviewSection,  } from "./client";
import styles from "./page.module.css";
import Image from "@/components/Image/Image";
import { requester } from "@/shared/Requester";

export default async function ({
  params,
}: {
  params: { category_id: string };
}) {
  const { category_id } = params;

  const initCondition: any = {
    pageSize: 24,
    _excludeType: true,
    warehousing: true,
    category_id,
  };

  const categoryProducts = await requester.getProducts(initCondition);

  return (
    <section className="root page_container">
      <Container marginTop={80}>
        <VerticalFlex className={styles.titleBox}>
          <VerticalFlex className={styles.title} gap={10}>
            <Image src={"/resources/images/header/logo.png"} width={100} />
            <h2 className="SacheonFont">BEST 상품</h2>
          </VerticalFlex>
        </VerticalFlex>

        <VerticalFlex>
          <ReviewSection category_id={category_id} />
        </VerticalFlex>
        <VerticalFlex>
          <CategoryTab category_id={category_id} />
        </VerticalFlex>

        <VerticalFlex marginBottom={30}>
          {/* <ProdcutCategoryFilter ConditionOrder={bestCondition} /> */}
        </VerticalFlex>

        <VerticalFlex className={Pstyles.list}>
          <BestList
            initProducts={categoryProducts}
            initConiditon={initCondition}
          />
        </VerticalFlex>
      </Container>
    </section>
  );
}
