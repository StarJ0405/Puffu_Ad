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
import MasonryGrid from "@/components/masonry/MasonryGrid";
import StarRate from "@/components/star/StarRate";
import { useAuth } from "@/providers/AuthPorivder/AuthPorivderClient";
import useData from "@/shared/hooks/data/useData";
import useNavigate from "@/shared/hooks/useNavigate";
import { requester } from "@/shared/Requester";
import NiceModal from "@ebay/nice-modal-react";
import clsx from "clsx";
import { useParams } from "next/navigation";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import ProductCard from "@/components/card/ProductCard";
import style from "./page.module.css";


import 'swiper/css';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import {Swiper as SwiperType} from 'swiper';



export function MainBanner() {
   const swiperRef = useRef<SwiperType | null>(null);

   const components = [ // 임시
      {img: '/resources/images/dummy_img/main_banner_01.png'},
      {img: '/resources/images/dummy_img/main_banner_01.png'},
      {img: '/resources/images/dummy_img/main_banner_01.png'},
   ]

   const paintBullets = (swiper: SwiperType) => { // 페이지네이션 스타일 설정
      const bullets = swiper.pagination?.el?.querySelectorAll('.swiper-pagination-bullet');
      if (!bullets) return;

      bullets.forEach((el) => {
         const bullet = el as HTMLElement;
         bullet.style.setProperty('background-color', '#000', 'important');
         bullet.style.setProperty('opacity', '0.3', 'important');
         bullet.style.setProperty('transform', 'scale(1)');
         bullet.style.setProperty('margin', '0 4px', 'important');
         bullet.style.setProperty('left', '0', 'important');
         bullet.style.setProperty('top', '2px', 'important');
      });

      const active = swiper.pagination?.el?.querySelector('.swiper-pagination-bullet-active') as HTMLElement | null;
      if (active) {
         active.style.setProperty('opacity', '1', 'important');
         active.style.setProperty('background-color', '#fff', 'important');
         active.style.setProperty('transform', 'scale(1.66)');
      }
   };

   return (
      <FlexChild className={clsx('desktop_container', style.main_banner)}>
         <Swiper
            loop={true}
            slidesPerView={1}
            speed={600}
            spaceBetween={40}
            modules={[Pagination, Autoplay]}
            pagination={{
              dynamicBullets: true,
            }}
            autoplay={{ delay: 4000 }}
            onSwiper={(swiper) => {
               swiperRef.current = swiper;
            }}
            onAfterInit={(swiper) => {
               // Pagination DOM이 생성된 뒤
               paintBullets(swiper);
            }}
            onSlideChange={(swiper) => {
               // active bullet이 바뀔 때마다
               paintBullets(swiper);
            }}
            onPaginationUpdate={(swiper) => {
               // dynamicBullets로 bullet 구성이 바뀌는 경우
               paintBullets(swiper);
            }}
         >
            {
               components.map((item, i) => {
               return (
                  <SwiperSlide key={i} className={`swiper_0${i}`}>
                     <div className={style.slideItem} style={{backgroundImage: `url(${item.img})`}}></div>
                  </SwiperSlide>
               )
               })
            }
         </Swiper>
      </FlexChild>
   )
}

export function ProductSlider() {
   const productItem = [ // 임시
      {
         thumbnail: '/resources/images/dummy_img/product_01.png',
         title: '블랙 골드버스트 바디수트',
         price: 30000,
         discount_rate: 12,
         discount_price: 20000,
      },
      {
         thumbnail: '/resources/images/dummy_img/product_02.png',
         title: '핑크색 일본 st 로제 베일 가벼움',
         price: 30000,
         discount_rate: 12,
         discount_price: 20000,
      },
      {
         thumbnail: '/resources/images/dummy_img/product_03.png',
         title: '뒷태 반전 유혹하는 파자마',
         price: 30000,
         discount_rate: 12,
         discount_price: 20000,
      },
      {
         thumbnail: '/resources/images/dummy_img/product_04.png',
         title: '스지망 쿠파 로린코 처녀궁 프리미엄 소프트',
         price: 30000,
         discount_rate: 12,
         discount_price: 20000,
      },
      {
         thumbnail: '/resources/images/dummy_img/product_05.png',
         title: '[유니더스/얇은콘돔형] 지브라 콘돔 1box(10p) [NR]',
         price: 30000,
         discount_rate: 12,
         discount_price: 20000,
      },
      {
         thumbnail: '/resources/images/dummy_img/product_06.png',
         title: '블랙 망사 리본 스타킹',
         price: 30000,
         discount_rate: 12,
         discount_price: 20000,
      },
      {
         thumbnail: '/resources/images/dummy_img/product_07.png',
         title: '섹시 스트랩 간호사 st 코스튬',
         price: 30000,
         discount_rate: 12,
         discount_price: 20000,
      },
   ]

   return (
      <FlexChild>
         <Swiper
            loop={true}
            slidesPerView={6}
            speed={600}
            spaceBetween={20}
            modules={[Autoplay]}
            // autoplay={{ delay: 4000 }}
         >
            {
               productItem.map((product, i) => {
               return (
                  <SwiperSlide key={i} className={`swiper_0${i}`}>
                     <VerticalFlex
                        width={200}
                        gap={15}
                        // margin={product.margin}
                        className={style.prodcut_item}
                     >
                        <FlexChild>
                           <Image src={product.thumbnail} width={"100%"} height={"auto"} />
                        </FlexChild>

                        <FlexChild padding={"0 5px"} className={style.text_box}>
                           <VerticalFlex gap={2}>
                              <FlexChild>

                              </FlexChild>
                              <FlexChild>
                                 <P weight={500} fontSize={14} ellipsis>
                                 {product.title}
                                 </P>
                              </FlexChild>
                              <FlexChild>
                                 <P
                                 color="#AAA"
                                 fontSize={10}
                                 weight={500}
                                 textDecoration={"line-through"}
                                 // hidden={product.discount_rate >= 1}
                                 >
                                 <Span>{product.price}</Span>
                                 {/* <Span>{currency_unit}</Span> */}
                                 </P>
                              </FlexChild>
                              <FlexChild>
                                 <P>
                                 <Span
                                    color="var(--main-color)"
                                    weight={600}
                                    fontSize={14}
                                    hidden={product.discount_rate >= 1}
                                    paddingRight={"0.5em"}
                                 >
                                    {product.discount_rate}
                                 </Span>
                                 <Span fontSize={14} weight={600}>
                                    {product.discount_price}
                                 </Span>
                                 {/* <Span fontSize={14} weight={600}>
                                    {currency_unit}
                                 </Span> */}
                                 </P>
                              </FlexChild>
                           </VerticalFlex>
                        </FlexChild>
                     </VerticalFlex>
                  </SwiperSlide>
               )
               })
            }
         </Swiper>
      </FlexChild>
   )
}


type ListItem = {
   thumbnail: string;
   title: string;
   price: number;
   discount_rate: number;
   discount_price: number;
}

export function ProductList() {

   const ListProduct: ListItem[] = [ // 임시
      {
         thumbnail: '/resources/images/dummy_img/product_01.png',
         title: '블랙 골드버스트 바디수트',
         price: 30000,
         discount_rate: 12,
         discount_price: 20000,
      },
      {
         thumbnail: '/resources/images/dummy_img/product_02.png',
         title: '핑크색 일본 st 로제 베일 가벼움',
         price: 30000,
         discount_rate: 12,
         discount_price: 20000,
      },
      {
         thumbnail: '/resources/images/dummy_img/product_03.png',
         title: '뒷태 반전 유혹하는 파자마',
         price: 30000,
         discount_rate: 12,
         discount_price: 20000,
      },
      {
         thumbnail: '/resources/images/dummy_img/product_04.png',
         title: '스지망 쿠파 로린코 처녀궁 프리미엄 소프트',
         price: 30000,
         discount_rate: 12,
         discount_price: 20000,
      },
      {
         thumbnail: '/resources/images/dummy_img/product_05.png',
         title: '[유니더스/얇은콘돔형] 지브라 콘돔 1box(10p) [NR]',
         price: 30000,
         discount_rate: 12,
         discount_price: 20000,
      },
      {
         thumbnail: '/resources/images/dummy_img/product_06.png',
         title: '블랙 망사 리본 스타킹',
         price: 30000,
         discount_rate: 12,
         discount_price: 20000,
      },
      {
         thumbnail: '/resources/images/dummy_img/product_07.png',
         title: '섹시 스트랩 간호사 st 코스튬',
         price: 30000,
         discount_rate: 12,
         discount_price: 20000,
      },
   ]

   return (
      <MasonryGrid gap={20} breakpoints={6}>
         {
            ListProduct.map((product, i) => {
               return (
                  <DummyProdcutCard
                     product={product}
                     lineClamp={2}
                     key={i}
                  />
               )
            })
         }
      </MasonryGrid>
   )
}


// lineClamp 구별해주기, 더미프로덕트카드는 임시로 만든거임. 나중에 프로덕트카드에 스타일만 입히면 됨.
// 프로덕트 카드에 하트랑 좋아요, 브랜드 이름 추가해야 함. 라인클램프는 제목태그에 달아서 속성 주기.


function DummyProdcutCard({ product, lineClamp }: { product: ListItem; lineClamp: number }) {
   return (
      <VerticalFlex
         width={200}
         gap={15}
         // margin={product.margin}
         paddingBottom={'40px'}
         className={style.prodcut_item}
      >
         <FlexChild>
            <Image src={product.thumbnail} width={"100%"} height={"auto"} />
         </FlexChild>

         <FlexChild padding={"0 5px"} className={style.text_box}>
            <VerticalFlex gap={2}>
               <FlexChild>
                  
               </FlexChild>
               <FlexChild>
                  <P weight={500} fontSize={14} ellipsis>
                  {product.title}
                  </P>
               </FlexChild>
               <FlexChild>
                  <P
                  color="#AAA"
                  fontSize={10}
                  weight={500}
                  textDecoration={"line-through"}
                  // hidden={product.discount_rate >= 1}
                  >
                  <Span>{product.price}</Span>
                  {/* <Span>{currency_unit}</Span> */}
                  </P>
               </FlexChild>
               <FlexChild>
                  <P>
                  <Span
                     color="var(--main-color)"
                     weight={600}
                     fontSize={14}
                     hidden={product.discount_rate >= 1}
                     paddingRight={"0.5em"}
                  >
                     {product.discount_rate}
                  </Span>
                  <Span fontSize={14} weight={600}>
                     {product.discount_price}
                  </Span>
                  {/* <Span fontSize={14} weight={600}>
                     {currency_unit}
                  </Span> */}
                  </P>
               </FlexChild>
            </VerticalFlex>
         </FlexChild>
      </VerticalFlex>
   )
}
