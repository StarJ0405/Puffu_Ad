import Container from "@/components/container/Container";
import clsx from "clsx";
import style from './page.module.css';

import { CartWrap } from "./client";


export default async function () {

   return (
      <section className="root page_container">
         <Container className={clsx('page_container', style.container)} marginTop={50}>
            <h3 className={style.title}>장바구니</h3>

            <CartWrap/>
         </Container>
      </section>
   )


}