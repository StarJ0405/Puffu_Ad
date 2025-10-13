import Container from "@/components/container/Container";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import { requester } from "@/shared/Requester";
import { BaseProductList } from "../../baseClient";
import Pstyles from "../../products.module.css";
import styles from "./page.module.css";
import { SearchParams } from "next/dist/server/request/search-params";

export default async function ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { category_id } = await searchParams;
  const hotCondition: any = { pageSize: 12, pageNumber: 0, order: "discount" };
  if (category_id) hotCondition.category_id = category_id;
  const hotProducts = await requester.getProducts(hotCondition);

  return (
    <section className="mob_root mob_page_container">
      <Container marginTop={35}>
        <VerticalFlex className={styles.titleBox}>
          <VerticalFlex className={styles.title}>
            <h2 className="SacheonFont" style={{ marginBottom: "12px" }}>
              <Image
                src="/resources/images/header/HotDeal_icon.png"
                width={24}
                height={"auto"}
              />
              이 달의 <Span color={"#FF4A4D"}>HOT</Span>딜
            </h2>
            <P width={"auto"}>매달 갱신되는 Hot Deal 상품!</P>
          </VerticalFlex>
        </VerticalFlex>

        <VerticalFlex className={Pstyles.list}>
          <BaseProductList
            id={"discount"}
            initProducts={hotProducts}
            initCondition={hotCondition}
          />
        </VerticalFlex>
      </Container>
    </section>
  );
}
