import Button from "@/components/buttons/Button";
import Container from "@/components/container/Container";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import P from "@/components/P/P";
import styles from './page.module.css';
import { } from './client';

import {SecondCategory, CategoryList, ProdcutCategory } from "./client";



export default async function () {

   return (
      <section className="root">
         <Container className="page_container" marginTop={80}>
            <VerticalFlex className={styles.title_box}>
               
               <h3>best 상품</h3>

               {/* 프로덕트 카테고리 */}
               <VerticalFlex marginBottom={30}>
                  <ProdcutCategory />
               </VerticalFlex>

               {/* <SecondCategory /> 대분류 안에 중분류 있을때, 중분류 안에 소분류 있을때만 나오기. */}

            </VerticalFlex>


            <VerticalFlex className={styles.list}>
               <CategoryList />
            </VerticalFlex>
         </Container>
      </section>
   )
}
