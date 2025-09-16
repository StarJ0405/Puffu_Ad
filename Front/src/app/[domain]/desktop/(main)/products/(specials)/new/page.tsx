import Container from "@/components/container/Container";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Span from "@/components/span/Span";
import Pstyles from "../../products.module.css";
import {} from "./client";
import styles from "./page.module.css";
import {NewList} from './client'
import { requester } from "@/shared/Requester";
import { CategoryFilter } from "./client";

export default async function () {
  const newCondition: any = {
    pageSize: 24,
    order: "new",
  };
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
          <NewList
            initProducts={newProducts}
            initConiditon={newCondition}
          />
        </VerticalFlex>
      </Container>
    </section>
  );
}
