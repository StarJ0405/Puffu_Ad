import Container from "@/components/container/Container";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Pstyles from '../../products.module.css';
import { } from './client';

import { BaseProductList } from "../../baseClient";



export default async function () {

   return (
      <section className="root">
         <Container className="page_container" marginTop={80}>
            <VerticalFlex className={Pstyles.title_box}>
               
               <h3>세트 상품</h3>
            </VerticalFlex>


            <VerticalFlex className={Pstyles.list}>
               <BaseProductList />
            </VerticalFlex>
         </Container>
      </section>
   )
}
