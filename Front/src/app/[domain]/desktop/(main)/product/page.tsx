import Button from "@/components/buttons/Button";
import Div from "@/components/div/Div";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
// import { MainCategory } from "../(shared)/Category/mainCategory";
import Icon from "@/components/icons/Icon";
import Image from "@/components/Image/Image";
import Container from "@/components/container/Container";
import P from "@/components/P/P";
import Select from "@/components/select/Select";
import Span from "@/components/span/Span";
import Link from "next/link";
import clsx from "clsx";
import style from './page.module.css';
import {ProductList} from '../client'
import {HotDealCategory, ProductCategory, MainCategory} from './client'


export default async function () {


   return (
      <section className="root">
         <Container className="desktop_container" marginTop={80}>
            <VerticalFlex className={style.title_box}>
               
               <h3>관리/보조</h3>

               {/* 프로덕트 카테고리 */}
               <VerticalFlex marginBottom={30}>
                  <MainCategory />
                  {/* <ProductCategory /> */}
                  {/* <HotDealCategory /> */}
               </VerticalFlex>

               <HorizontalFlex className={style.sort_group}>
                  <FlexChild className={style.count_txt}>
                     <P>
                        <b>38</b>개의 상품
                     </P>
                  </FlexChild>

                  <FlexChild width={'auto'}>
                     <HorizontalFlex className={style.sort_box}>
                        <Button className={style.sort_btn}>인기순</Button>
                        <Button className={style.sort_btn}>추천순</Button>
                        <Button className={style.sort_btn}>최신순</Button>
                     </HorizontalFlex>
                  </FlexChild>
               </HorizontalFlex>
            </VerticalFlex>


            <VerticalFlex className={style.list}>

               <ProductList />
            </VerticalFlex>
         </Container>
      </section>
   )
}
