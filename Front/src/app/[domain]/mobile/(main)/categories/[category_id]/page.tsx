import Container from "@/components/container/Container";
import VerticalFlex from "@/components/flex/VerticalFlex";
import { requester } from "@/shared/Requester";
import { Params } from "next/dist/server/request/params";
import { BaseProductList } from "../../products/baseClient";
import { TitleBox } from "./client";
import styles from "./page.module.css";

export default async function ({ params }: { params: Promise<Params> }) {
  const { category_id } = await params;

  const initCondition = {
    category_id,
    pageSize: 12,
  };

  const initProducts = await requester.getProducts(initCondition);

  return (
    <section className="root page_container">
      <Container marginTop={35}>
        <TitleBox category_id={category_id} />

        <VerticalFlex className={styles.list}>
          <BaseProductList
            id="categories"
            initCondition={initCondition}
            initProducts={initProducts}
          />
        </VerticalFlex>
      </Container>
    </section>
  );
}
