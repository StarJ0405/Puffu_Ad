import Button from "@/components/buttons/Button";
import Div from "@/components/div/Div";
import Container from "@/components/container/Container";
import Center from "@/components/center/Center";
import Input from "@/components/inputs/Input";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import CheckboxAll from "@/components/choice/checkbox/CheckboxAll";
import CheckboxChild from "@/components/choice/checkbox/CheckboxChild";
import CheckboxGroup from "@/components/choice/checkbox/CheckboxGroup";
import Icon from "@/components/icons/Icon";
import Image from "@/components/Image/Image";
import InputNumber from "@/components/inputs/InputNumber";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import Link from "next/link";
import clsx from "clsx";
import style from './page.module.css'

import { DetaillTop } from "./client";

export default async function () {

   return (
      <section className="root">
         <Container className={clsx('desktop_container', style.detail_container)} marginTop={100}>
            <HorizontalFlex>
               <FlexChild className={style.detail_thumbnail}>
                  <Image 
                     src={'/resources/images/dummy_img/product_07.png'}
                     width={600}
                     height={'auto'}
                   />
               </FlexChild>

               <VerticalFlex className={style.detail_infoBox}>
                  <FlexChild className={style.brand}>
                     <Span>브랜드정보</Span>
                  </FlexChild>

                  <FlexChild className={style.detail_title}>
                     <P>상품제목</P>
                  </FlexChild>

                  <HorizontalFlex>
                     <FlexChild className={style.price}>
                        <P>25,000</P> ₩
                     </FlexChild>
   
                     <FlexChild>
                        <P>15%</P>
                     </FlexChild>

                     <FlexChild>
                        <P>28,000₩</P>
                     </FlexChild>
                  </HorizontalFlex>

                  <HorizontalFlex className={style.info_box}>
                     <FlexChild className={style.delivery_info}>
                        <P>배송정보</P>
                        <Image 
                          src={'/resources/icons/cart/cj_icon.png'}
                          width={22}
                        />
                     </FlexChild>

                     <FlexChild>{/* 링크 공유 버튼 */}
                        <Image 
                          src={'/resources/icons/main/share_icon.png'}
                          width={25}
                        />
                     </FlexChild>
                  </HorizontalFlex>

                  <VerticalFlex>
                     <FlexChild>
                        <P>배송</P>
                        <P>오후 4시 이전 주문 결제시 오늘 출발! ( 영업일 기준 )</P>
                        <P>30,000원 이상 구매시 무료배송</P>
                     </FlexChild>
                  </VerticalFlex>
               </VerticalFlex>
            </HorizontalFlex>
         </Container>
      </section>
   )


}