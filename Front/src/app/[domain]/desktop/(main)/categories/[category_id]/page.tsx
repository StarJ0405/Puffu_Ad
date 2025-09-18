import Button from "@/components/buttons/Button";
import Container from "@/components/container/Container";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import P from "@/components/P/P";
import styles from "./page.module.css";
import {} from "./client";

import { CategoryList, TitleBox } from "./client";
import { Params } from "next/dist/server/request/params";
import { requester } from "@/shared/Requester";
import { log } from "@/shared/utils/Functions";

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
