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

   const optionTest = [
      {name: '블랙 망사 리본 스타킹', quantity: 1, price: '0'},
      {name: '크리스마스 요정님 선물 담는 양말', quantity: 2, price: '1,000'},
      {name: '작은하마가 좋아하는 작은 칼 딜도', quantity: 1, price: '0'},
   ]

   return (
      <section className="root">
         <Container className={clsx('desktop_container', style.detail_container)} marginTop={100}>
            <HorizontalFlex gap={60} alignItems="start">
               <FlexChild className={style.detail_thumbnail}>
                  <Image 
                     src={'/resources/images/dummy_img/review_img_01.png'}
                     width={600}
                     height={'auto'}
                   />
               </FlexChild>

               <VerticalFlex className={style.detail_infoBox} alignItems="start">
                  <FlexChild className={style.brand}>
                     <Span>브랜드정보</Span>
                  </FlexChild>

                  <FlexChild className={style.detail_title}>
                     <P lineClamp={2} display="--webkit-box" overflow="hidden">상품제목</P>
                  </FlexChild>

                  <HorizontalFlex marginBottom={17} gap={10}>
                     <FlexChild className={style.price} marginLeft={5}>
                        <P>25,000</P> ₩
                     </FlexChild>
   
                     <FlexChild className={style.sale_price}>
                        <P>15%</P>
                     </FlexChild>

                     <FlexChild className={style.regular_price}>
                        <P>28,000₩</P>
                     </FlexChild>
                  </HorizontalFlex>

                  <HorizontalFlex className={style.delivery_share_box}>
                     <FlexChild className={style.delivery_info}>
                        <P>배송정보</P>
                        <Image 
                          src={'/resources/icons/cart/cj_icon.png'}
                          width={22}
                        />
                     </FlexChild>

                     <FlexChild cursor="pointer">{/* 링크 공유 버튼 */}
                        <Image 
                          src={'/resources/icons/main/share_icon.png'}
                          width={25}
                        />
                        {/* <Image share 액티브 아이콘
                          src={'/resources/icons/main/share_icon_action.png'}
                          width={25}
                        /> */}
                     </FlexChild>
                  </HorizontalFlex>

                  <VerticalFlex className={style.delivery_admin_write_data}>
                     <VerticalFlex alignItems="start" gap={5}>
                        <P size={16} color="#bbb" weight={600}>배송</P>
                        <P size={14} color="#ddd">오후 2시 이전 주문 결제시 오늘 출발! ( 영업일 기준 )</P>
                        <P size={14} color="#ddd">30,000원 이상 구매시 무료배송</P>
                     </VerticalFlex>
                  </VerticalFlex>
                  

                  <VerticalFlex className={style.option_box}>
                     {
                        optionTest.map((item, i) => (
                           <HorizontalFlex key={i}>
                              <InputNumber />
                              <FlexChild key={i} className={style.txt_item}>
                                 <P>{item.name}</P>
                                 <Span>{item.quantity}개</Span>
                                 <Span>+ {item.price}원</Span>
                              </FlexChild>
                           </HorizontalFlex>
                        ))
                     }
                  </VerticalFlex>

                  <HorizontalFlex className={style.total_box}>
                     
                  </HorizontalFlex>
               </VerticalFlex>
            </HorizontalFlex>
         </Container>
      </section>
   )


}