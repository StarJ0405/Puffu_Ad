"use client"
import Button from "@/components/buttons/Button";
import Div from "@/components/div/Div";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Icon from "@/components/icons/Icon";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import Select from "@/components/select/Select";
import Span from "@/components/span/Span";
import CheckboxAll from "@/components/choice/checkbox/CheckboxAll";
import CheckboxChild from "@/components/choice/checkbox/CheckboxChild";
import CheckboxGroup from "@/components/choice/checkbox/CheckboxGroup";
import { useAuth } from "@/providers/AuthPorivder/AuthPorivderClient";
import useData from "@/shared/hooks/data/useData";
import useNavigate from "@/shared/hooks/useNavigate";
import { requester } from "@/shared/Requester";
import NiceModal from "@ebay/nice-modal-react";
import clsx from "clsx";
import { useParams } from "next/navigation";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import ProductCard from "@/components/card/ProductCard";
import styles from "./page.module.css";
import Input from "@/components/inputs/Input";
import InputNumber from "@/components/inputs/InputNumber";
import ListPagination from "@/components/listPagination/ListPagination";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, Navigation } from 'swiper/modules';
import {Swiper as SwiperType} from 'swiper';
import NoContent from "@/components/noContent/noContent";
import TestProductCard from "@/components/card/TestProductCard";


import Description from './description/description'
import Review from './review/review'
import Inquiry from './inquiry/inquiry'
import DeliveryGuide from './deliveryGuide/deliveryGuide'


type Option = {
  name: string;
  quantity: number;
  price: string;
};


// 미니 구매란
export function MiniInfoBox({optionTest} : {optionTest : Option[]}) {
   return (
      <FlexChild width={'auto'} className={styles.mini_infoBox}>
         <VerticalFlex>
            <VerticalFlex gap={20} marginBottom={30}>
               {
                  optionTest.map((item, i) => (
                     <OptionItem item={item} key={i} />
                  ))
               }
            </VerticalFlex>

            <HorizontalFlex className={styles.total_box} gap={10}>
               <P className={styles.total_txt}>총 상품 금액</P>

               <FlexChild className={styles.price} width={'auto'} justifyContent="end">
                  <P>25,000</P> ₩
               </FlexChild>
            </HorizontalFlex>

            <BuyButtonGroup/>
         </VerticalFlex>
      </FlexChild>
   )
}


// 옵션 개수 계산기
export function OptionItem({item} : {item : Option}) {

   return (
      <HorizontalFlex className={styles.option_item}>
         <InputNumber />
         <FlexChild className={styles.txt_item} gap={10} width={'auto'}>
            <P>{item.name}</P>
            <FlexChild width={'auto'} gap={5}>
               <Span>{item.quantity}개</Span>
               <Span>+ {item.price}원</Span>
            </FlexChild>
         </FlexChild>
      </HorizontalFlex>
   )
}

// 좋아요 장바구니 구매버튼 묶음
export function BuyButtonGroup() {
   return(
      <HorizontalFlex className={styles.buyButton_box}>
         <FlexChild width={'auto'}>
            <Button className={styles.heart_btn}>
               <Image src={'/resources/icons/main/product_heart_icon.png'} width={30} />
               {/* <Image src={'/resources/icons/main/product_heart_icon_active.png'} width={30} /> */}
            </Button>
         </FlexChild>

         <FlexChild className={styles.cart_box}>
            <Button className={styles.cart_btn}>
               <P>장바구니</P>
            </Button>
         </FlexChild>

         <FlexChild className={styles.buy_box}>
            <Button className={styles.buy_btn}>
               <P>바로 구매</P>
            </Button>
         </FlexChild>
      </HorizontalFlex>
   )
}


type ListItem = {
   thumbnail: string;
   title: string;
   price: number;
   discount_rate: number;
   discount_price: number;
   heart_count: number;
   store_name: string;
   rank: number;
}

export function ProductSlider({id, lineClamp }: { id: string, lineClamp?: number }) {
   
   const ListProduct: ListItem[] = [ // 임시
      {
         thumbnail: '/resources/images/dummy_img/product_01.png',
         title: '블랙 골드버스트 바디수트',
         price: 30000,
         discount_rate: 12,
         discount_price: 20000,
         heart_count: 10,
         store_name: '키테루 키테루',
         rank: 0,
      },
      {
         thumbnail: '/resources/images/dummy_img/product_02.png',
         title: '핑크색 일본 st 로제 베일 가벼움',
         price: 30000,
         discount_rate: 12,
         discount_price: 20000,
         heart_count: 100,
         store_name: '키테루 키테루',
         rank: 1,
      },
      {
         thumbnail: '/resources/images/dummy_img/product_03.png',
         title: '뒷태 반전 유혹하는 파자마',
         price: 30000,
         discount_rate: 12,
         discount_price: 20000,
         heart_count: 100,
         store_name: '키테루 키테루',
         rank: 2,
      },
      {
         thumbnail: '/resources/images/dummy_img/product_04.jpg',
         title: '스지망 쿠파 로린코 처녀궁 프리미엄 소프트',
         price: 30000,
         discount_rate: 12,
         discount_price: 20000,
         heart_count: 70,
         store_name: '키테루 키테루',
         rank: 3,
      },
      {
         thumbnail: '/resources/images/dummy_img/product_05.png',
         title: '[유니더스/얇은콘돔형] 지브라 콘돔 1box(10p) [NR]',
         price: 30000,
         discount_rate: 12,
         discount_price: 20000,
         heart_count: 4,
         store_name: '키테루 키테루',
         rank: 4,
      },
      {
         thumbnail: '/resources/images/dummy_img/product_06.png',
         title: '블랙 망사 리본 스타킹',
         price: 30000,
         discount_rate: 12,
         discount_price: 20000,
         heart_count: 1020,
         store_name: '키테루 키테루',
         rank: 5,
      },
      {
         thumbnail: '/resources/images/dummy_img/product_07.png',
         title: '섹시 스트랩 간호사 st 코스튬',
         price: 30000,
         discount_rate: 12,
         discount_price: 20000,
         heart_count: 1030,
         store_name: '키테루 키테루',
         rank: 6,
      },

      {
         thumbnail: '/resources/images/dummy_img/product_07.png',
         title: '섹시 스트랩 간호사 st 코스튬',
         price: 30000,
         discount_rate: 12,
         discount_price: 20000,
         heart_count: 1030,
         store_name: '키테루 키테루',
         rank: 6,
      },

      {
         thumbnail: '/resources/images/dummy_img/product_07.png',
         title: '섹시 스트랩 간호사 st 코스튬',
         price: 30000,
         discount_rate: 12,
         discount_price: 20000,
         heart_count: 1030,
         store_name: '키테루 키테루',
         rank: 6,
      },

      {
         thumbnail: '/resources/images/dummy_img/product_07.png',
         title: '섹시 스트랩 간호사 st 코스튬',
         price: 30000,
         discount_rate: 12,
         discount_price: 20000,
         heart_count: 1030,
         store_name: '키테루 키테루',
         rank: 6,
      },
   ]

   return (
      <>
         {ListProduct.length > 0 ? (
         <FlexChild id={id} className={styles.ProductSlider}>
            <Swiper
               loop={true}
               slidesPerView={6}
               speed={600}
               spaceBetween={20}
               modules={[Autoplay, Navigation]}
               autoplay={{ delay: 4000 }}
               navigation={{
                  prevEl: `#${id} .${styles.prevBtn}`,
                  nextEl: `#${id} .${styles.nextBtn}`,
               }}
            >
               {
                  ListProduct.map((product, i) => {
                  return (
                     <SwiperSlide key={i}>
                        <TestProductCard
                           product={product}
                           lineClamp={lineClamp ?? 2}
                        />
                     </SwiperSlide>
                  )
                  })
               }
            </Swiper>
   
            <div className={clsx(styles.naviBtn, styles.prevBtn)}>
              <Image src={'/resources/icons/arrow/slide_arrow.png'} width={10}></Image>
            </div>
            <div className={clsx(styles.naviBtn, styles.nextBtn)}>
              <Image src={'/resources/icons/arrow/slide_arrow.png'} width={10}></Image>
            </div>
         </FlexChild>
         ): (
            <NoContent type="상품" />
         )}
      </>
   )
}


// 제품 정보 및 내용
export function DetailTabContainer() {

   const [tabParams, setTabParams] = useState('description');
   const tabParamsChange = (params: string) => {
      setTabParams(params);
   }

   const tabAraays = [
      {name: '상세정보' , paramsName: 'description', component: <Description />},
      {name: '사용후기' , paramsName: 'review', component: <Review />},
      {name: '상품 Q&A' , paramsName: 'inquiry', component: <Inquiry /> },
      {name: '배송/반품/교환/안내' , paramsName: 'deliveryGuide', component: <DeliveryGuide />},
   ]

   return (
      <>
         <HorizontalFlex className={styles.tab_wrap}>
            {
               tabAraays.map((item)=> (
                  <FlexChild 
                     key={item.paramsName}
                     className={
                        clsx(
                           styles.content_tab, 
                           tabParams === `${item.paramsName}` && styles.active
                        )
                     }
                     onClick={() => tabParamsChange(`${item.paramsName}`)}
                  >
                     <P>
                        {item.name}
                        {
                           (['review', 'inquiry'].includes(item.paramsName)) && (
                              <Span className={styles.list_count}>34</Span> // 리뷰, qna 개수 출력
                           )
                        }
                     </P>
                  </FlexChild>
               ))
            }
         </HorizontalFlex>

         <VerticalFlex className={styles.content_view}>
            <article key={tabParams} className={styles.tab_fade}>
               {tabAraays.find((t) => t.paramsName === tabParams)?.component}
            </article>
         </VerticalFlex>
      </>
   )
}