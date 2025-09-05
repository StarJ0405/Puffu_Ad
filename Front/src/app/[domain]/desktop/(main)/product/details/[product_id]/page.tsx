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
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import Link from "next/link";
import clsx from "clsx";
import styles from './page.module.css'

import { OptionItem, BuyButtonGroup, ContentView } from "./client";

export default async function () {

   const optionTest = [
      {name: '블랙 망사 리본 스타킹', quantity: 1, price: '0'},
      {name: '크리스마스 요정님 선물 담는 양말', quantity: 2, price: '1,000'},
      {name: '작은하마가 좋아하는 작은 칼 딜도', quantity: 1, price: '0'},
   ]

   return (
      <section className="root">
         <Container className={clsx('desktop_container', styles.detail_container)} marginTop={100}>
            <HorizontalFlex gap={60} alignItems="start">
               <FlexChild className={styles.detail_thumbnail}>
                  <Image 
                     src={'/resources/images/dummy_img/review_img_01.png'}
                     width={600}
                     height={'auto'}
                   />
               </FlexChild>

               <VerticalFlex className={styles.detail_infoBox} alignItems="start">
                  <FlexChild className={styles.brand}>
                     <Span>브랜드정보</Span>
                  </FlexChild>

                  <FlexChild className={styles.detail_title}>
                     <P lineClamp={2} display="--webkit-box" overflow="hidden">상품제목</P>
                  </FlexChild>

                  <HorizontalFlex marginBottom={17} gap={10}>
                     <FlexChild className={styles.price} marginLeft={5}>
                        <P>25,000</P> ₩
                     </FlexChild>
   
                     <FlexChild className={styles.sale_price}>
                        <P>15%</P>
                     </FlexChild>

                     <FlexChild className={styles.regular_price}>
                        <P>28,000₩</P>
                     </FlexChild>
                  </HorizontalFlex>

                  <HorizontalFlex className={styles.delivery_share_box}>
                     <FlexChild className={styles.delivery_info}>
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

                  <VerticalFlex className={styles.delivery_admin_write_data}>
                     <VerticalFlex alignItems="start" gap={5}>
                        <P size={16} color="#bbb" weight={600}>배송</P>
                        <P size={14} color="#ddd">오후 2시 이전 주문 결제시 오늘 출발! ( 영업일 기준 )</P>
                        <P size={14} color="#ddd">30,000원 이상 구매시 무료배송</P>
                     </VerticalFlex>
                  </VerticalFlex>
                  

                  <VerticalFlex className={styles.option_box}>
                     {
                        optionTest.map((item, i) => (
                           <OptionItem item={item} key={i} />
                        ))
                     }
                  </VerticalFlex>

                  <HorizontalFlex className={styles.total_box}>
                     <P className={styles.total_txt}>총 상품 금액</P>

                     <FlexChild className={styles.price} width={'auto'}>
                        <P>25,000</P> ₩
                     </FlexChild>
                  </HorizontalFlex>

                  <BuyButtonGroup/>
               </VerticalFlex>
            </HorizontalFlex>

            <HorizontalFlex marginTop={30}>
               <VerticalFlex className={styles.contents_container} width={'100%'} maxWidth={850}>

                  <HorizontalFlex className={styles.tab_wrap}>
                     <FlexChild className={clsx(styles.content_tab, styles.active)}>
                        <P>상세설명</P>
                     </FlexChild>

                     <FlexChild className={clsx(styles.content_tab)}>
                        <P>사용후기</P>
                        <Span className={styles.review_count}>36</Span>
                     </FlexChild>

                     <FlexChild className={clsx(styles.content_tab)}>
                        <P>상품 Q&A</P>
                     </FlexChild>

                     <FlexChild className={clsx(styles.content_tab)}>
                        <P>배송/반품/교환 안내</P>
                     </FlexChild>
                  </HorizontalFlex>
                  
                  <VerticalFlex className={styles.content_view}>
                     <ContentView />
                  </VerticalFlex>

               </VerticalFlex>

               <FlexChild width={'auto'}>
                  <></>
               </FlexChild>
            </HorizontalFlex>
         </Container>
      </section>
   )


}