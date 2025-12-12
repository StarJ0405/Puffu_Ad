import Container from "@/components/container/Container";
import VerticalFlex from "@/components/flex/VerticalFlex";
import { TitleBox } from "./client";
import styles from "./page.module.css";

import { requester } from "@/shared/Requester";
import { Params } from "next/dist/server/request/params";
import { CategoryList } from "./client";

export default async function ({ params }: { params: Promise<Params> }) {
  const { category_id } = await params;

  const initCondition = {
    category_id,
    pageSize: 24,
  };

  const initProducts = await requester.getProducts(initCondition);

  return (
    <section className="root">
      <Container className="page_container" marginTop={80}>

        <TitleBox category_id={category_id} />

        <VerticalFlex className={styles.list}>
          <CategoryList
            initCondition={initCondition}
            initProducts={initProducts}
          />
        </VerticalFlex>
      </Container>
    </section>
  );
}
