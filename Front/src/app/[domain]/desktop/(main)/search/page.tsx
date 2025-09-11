import Button from "@/components/buttons/Button";
import Container from "@/components/container/Container";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import P from "@/components/P/P";
import styles from './page.module.css';

import {SecondCategory, SearchList, ProdcutCategory } from "./client";



export default async function () {

   return (
      <section className="root">
         <Container className="page_container" marginTop={80}>
            <VerticalFlex className={styles.title_box}>
               
               <h3>"검색한 상품명" 검색결과</h3>

               <P>0개의 상품이 검색되었습니다.</P>
            </VerticalFlex>


            <VerticalFlex className={styles.list}>
               <SearchList />
            </VerticalFlex>
         </Container>
      </section>
   )
}
