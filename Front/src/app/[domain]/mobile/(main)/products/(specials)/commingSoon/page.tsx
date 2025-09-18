import Container from "@/components/container/Container";
import VerticalFlex from "@/components/flex/VerticalFlex";
import { requester } from "@/shared/Requester";
import { BaseProductList } from "../../baseClient";
import Pstyles from "../../products.module.css";

export default async function () {
  const newCondition: any = {
    pageSize: 24,
    order: "new",
  };
  const newProducts = await requester.getProducts(newCondition);

  return (
    <section className="root page_container">
      <Container marginTop={35}>
        <VerticalFlex className={Pstyles.title_box}>
          <h3>입고예정</h3>
        </VerticalFlex>

        <VerticalFlex className={Pstyles.list}>
          <BaseProductList
            initProducts={newProducts}
            initCondition={newCondition}
            id="comming"
            commingSoon
          />
        </VerticalFlex>
      </Container>
    </section>
  );
}
