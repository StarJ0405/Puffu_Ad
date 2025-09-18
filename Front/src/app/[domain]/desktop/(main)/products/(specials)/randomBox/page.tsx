import Container from "@/components/container/Container";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Pstyles from "../../products.module.css";
import { requester } from "@/shared/Requester";
import { BaseProductList } from "../../baseClient";

export default async function () {
  const newCondition: any = {
    pageSize: 24,
    order: "new",
  };
  const newProducts = await requester.getProducts(newCondition);

  return (
    <section className="root">
      <Container className="page_container" marginTop={80}>
        <VerticalFlex className={Pstyles.title_box}>
          <h3>랜덤박스</h3>
        </VerticalFlex>

        <VerticalFlex className={Pstyles.list}>
          <BaseProductList listArray={newProducts} />
        </VerticalFlex>
      </Container>
    </section>
  );
}
