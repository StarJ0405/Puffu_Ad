import Container from "@/components/container/Container";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Span from "@/components/span/Span";
import { requester } from "@/shared/Requester";
import { SearchParams } from "next/dist/server/request/search-params";
import Pstyles from "../../products.module.css";
import { NewList } from "./client";
import styles from "./page.module.css";

export default async function ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { category_id } = await searchParams;
  const newCondition: any = {
    pageSize: 24,
    order: "new",
  };
  if (category_id) newCondition.category_id = category_id;

  const newProducts = await requester.getProducts(newCondition);

  return (
    <section className="root">
      <Container className="page_container" marginTop={80}>
        <VerticalFlex className={styles.titleBox}>
          <VerticalFlex className={styles.title}>
            <h2 className="SacheonFont">
              <Span>따끈따끈</Span> 신상품
            </h2>
          </VerticalFlex>
        </VerticalFlex>

        <VerticalFlex marginBottom={30}>
          {/* <CategoryFilter /> */}
        </VerticalFlex>

        <VerticalFlex className={Pstyles.list}>
          <NewList initProducts={newProducts} initConiditon={newCondition} />
        </VerticalFlex>
      </Container>
    </section>
  );
}
