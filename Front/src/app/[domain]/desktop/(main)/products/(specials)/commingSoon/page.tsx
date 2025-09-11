import Button from "@/components/buttons/Button";
import Container from "@/components/container/Container";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import P from "@/components/P/P";
import Pstyles from '../../products.module.css';
import { } from './client';

import { SortFilter, BaseProductList } from "../../baseClient";



export default async function () {

   return (
      <section className="root">
         <Container className="page_container" marginTop={80}>
            <VerticalFlex className={Pstyles.title_box}>
               
               <h3>입고예정</h3>

            </VerticalFlex>


            <VerticalFlex className={Pstyles.list}>
               <BaseProductList commingSoon={true} />
            </VerticalFlex>
         </Container>
      </section>
   )
}
