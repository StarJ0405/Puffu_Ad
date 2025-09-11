import Button from "@/components/buttons/Button";
import Container from "@/components/container/Container";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import P from "@/components/P/P";
import Pstyles from '../../products.module.css';
import styles from './page.module.css';
import { } from './client';
import Span from "@/components/span/Span";

import {SecondCategory, BaseProductList, ProdcutCategory } from "../../baseClient";
import Image from "@/components/Image/Image";



export default async function () {

   return (
      <section className="root">
         <Container className="page_container" marginTop={80}>
            <VerticalFlex className={styles.titleBox}>
              <VerticalFlex className={styles.title} gap={10}>
               <Image src={'/resources/images/header/logo.png'} width={100} />
                <h2 className="SacheonFont">
                  BEST 상품
                </h2>
              </VerticalFlex>
            </VerticalFlex>

            <VerticalFlex marginBottom={30}>
               <ProdcutCategory />
            </VerticalFlex>


            <VerticalFlex className={Pstyles.list}>
               <BaseProductList specialType={'best'} />
            </VerticalFlex>
         </Container>
      </section>
   )
}
