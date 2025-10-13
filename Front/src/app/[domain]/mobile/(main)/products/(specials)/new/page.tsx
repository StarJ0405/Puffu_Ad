import Container from "@/components/container/Container";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Span from "@/components/span/Span";
import { requester } from "@/shared/Requester";
import { SearchParams } from "next/dist/server/request/search-params";
import { BaseProductList, ProdcutCategoryFilter } from "../../baseClient";
import Pstyles from "../../products.module.css";
import styles from "./page.module.css";

export default async function ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { category_id } = await searchParams;
  const newCondition: any = { pageSize: 12, pageNumber: 0, order: "new" };
  if (category_id) newCondition.category_id = category_id;
  const newProducts = await requester.getProducts(newCondition);

  return (
    <section className="mob_root mob_page_container">
      <Container marginTop={35}>
        <VerticalFlex className={styles.titleBox}>
          <VerticalFlex className={styles.title}>
            <h2 className="SacheonFont">
              <Span>따끈따끈</Span> 신상품
            </h2>
          </VerticalFlex>
        </VerticalFlex>

        <ProdcutCategoryFilter ConditionOrder={newCondition} />

        <VerticalFlex className={Pstyles.list}>
          <BaseProductList
            id={"new"}
            initProducts={newProducts}
            initCondition={newCondition}
          />
        </VerticalFlex>
      </Container>
    </section>
  );
}
