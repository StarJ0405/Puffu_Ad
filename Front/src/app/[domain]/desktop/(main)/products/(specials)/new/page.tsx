import Container from "@/components/container/Container";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Span from "@/components/span/Span";
import Pstyles from "../../products.module.css";
import { } from "./client";
import styles from "./page.module.css";

import {
   BaseProductList,
   ProdcutCategory
} from "../../baseClient";

export default async function () {
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
          <ProdcutCategory />
        </VerticalFlex>

        <VerticalFlex className={Pstyles.list}>
          <BaseProductList />
        </VerticalFlex>
      </Container>
    </section>
  );
}
