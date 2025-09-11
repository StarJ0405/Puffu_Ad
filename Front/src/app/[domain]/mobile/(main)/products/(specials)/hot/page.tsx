import Button from "@/components/buttons/Button";
import Container from "@/components/container/Container";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import P from "@/components/P/P";
import Pstyles from '../../products.module.css';
import styles from './page.module.css';
import { } from './client';
import { BaseProductList } from "../../baseClient";
import { HotDealCategory} from "./client";
import Image from "@/components/Image/Image";
import Span from "@/components/span/Span";
import clsx from "clsx";
import Link from "next/link";



export default async function () {

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
               <BaseProductList />
            </VerticalFlex>
         </Container>
      </section>
   )
}
