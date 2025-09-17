import Container from "@/components/container/Container";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
// import { HotList } from "./client";
import Pstyles from "../../products.module.css";
import {} from "./client";
import styles from "./page.module.css";
import { requester } from "@/shared/Requester";
import {HotList} from './client'

export default async function () {
  const hotCondition: any = {
    pageSize: 24,
    order: "discount",
  };
  const hotProducts = await requester.getProducts(hotCondition);



  return (
    <section className="root">
      <Container className="page_container" marginTop={80}>
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
          <HotList
            initProducts={hotProducts}
            initConiditon={hotCondition}
          />
        </VerticalFlex>
      </Container>
    </section>
  );
}
