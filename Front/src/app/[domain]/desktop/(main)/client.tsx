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


import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, Navigation } from 'swiper/modules';
import {Swiper as SwiperType} from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';


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



type ListItem = {
   thumbnail: string;
   title: string;
   price: number;
   discount_rate: number;
   discount_price: number;
   heart_count: number,
   store_name: string;
}

const ListProduct: ListItem[] = [ // 임시
      {
         thumbnail: '/resources/images/dummy_img/product_01.png',
         title: '블랙 골드버스트 바디수트',
         price: 30000,
         discount_rate: 12,
         discount_price: 20000,
         heart_count: 10,
         store_name: '키테루 키테루',
      },
      {
         thumbnail: '/resources/images/dummy_img/product_02.png',
         title: '핑크색 일본 st 로제 베일 가벼움',
         price: 30000,
         discount_rate: 12,
         discount_price: 20000,
         heart_count: 100,
         store_name: '키테루 키테루',
      },
      {
         thumbnail: '/resources/images/dummy_img/product_03.png',
         title: '뒷태 반전 유혹하는 파자마',
         price: 30000,
         discount_rate: 12,
         discount_price: 20000,
         heart_count: 100,
         store_name: '키테루 키테루',
      },
      {
         thumbnail: '/resources/images/dummy_img/product_04.png',
         title: '스지망 쿠파 로린코 처녀궁 프리미엄 소프트',
         price: 30000,
         discount_rate: 12,
         discount_price: 20000,
         heart_count: 70,
         store_name: '키테루 키테루',
      },
      {
         thumbnail: '/resources/images/dummy_img/product_05.png',
         title: '[유니더스/얇은콘돔형] 지브라 콘돔 1box(10p) [NR]',
         price: 30000,
         discount_rate: 12,
         discount_price: 20000,
         heart_count: 4,
         store_name: '키테루 키테루',
      },
      {
         thumbnail: '/resources/images/dummy_img/product_06.png',
         title: '블랙 망사 리본 스타킹',
         price: 30000,
         discount_rate: 12,
         discount_price: 20000,
         heart_count: 1020,
         store_name: '키테루 키테루',
      },
      {
         thumbnail: '/resources/images/dummy_img/product_07.png',
         title: '섹시 스트랩 간호사 st 코스튬',
         price: 30000,
         discount_rate: 12,
         discount_price: 20000,
         heart_count: 1030,
         store_name: '키테루 키테루',
      },
   ]


export function ProductSlider({ lineClamp }: { lineClamp?: number }) {

   return (
      <FlexChild>
         <Swiper
            loop={true}
            slidesPerView={6}
            speed={600}
            spaceBetween={20}
            modules={[Autoplay, Navigation]}
            autoplay={{ delay: 4000 }}
            navigation={true}
         >
            {
               ListProduct.map((product, i) => {
               return (
                  <SwiperSlide key={i} className={`swiper_0${i}`}>
                     <DummyProdcutCard
                        product={product}
                        lineClamp={lineClamp ?? 2}
                        key={i}
                     />
                  </SwiperSlide>
               )
               })
            }
         </Swiper>
      </FlexChild>
   )
}




export function ProductList() {

   return (
      <MasonryGrid gap={20} breakpoints={5}>
         {
            ListProduct.map((product, i) => {
               return (
                  <DummyProdcutCard
                     product={product}
                     lineClamp={2}
                     key={i}
                     width={244}
                  />
               )
            })
         }
      </MasonryGrid>
   )
}


// lineClamp 구별해주기, DummyProdcutCard는 임시로 만든거임. 나중에 프로덕트카드에 스타일만 입히면 됨.
// 프로덕트 카드에 하트랑 좋아요, 브랜드 이름 추가해야 함. 라인클램프는 제목태그에 달아서 속성 주기.

function DummyProdcutCard({ product, lineClamp, width }: { product: ListItem; lineClamp: number; width?: number }) {


   // 프로덕트 카드 쓰면 다 지워도 됨.
   const [heartCheck, setHeartCheck] = useState(false);
   const [heartCount, setHeartCount] = useState(product.heart_count);
   

   const toggleHeart = () => {
   setHeartCheck(prev => !prev);
   setHeartCount(prev => prev + (heartCheck ? -1 : 1));
   };

   return (
      <VerticalFlex
         width={width ?? 200}
         // margin={product.margin}
         className={style.prodcut_item}
      >
         <FlexChild>
            <Image src={product.thumbnail} width={"100%"} height={"auto"} />
         </FlexChild>

         <FlexChild padding={"0 5px"} className={style.text_box}>
            <VerticalFlex gap={2} alignItems={'start'}>
               <FlexChild className={style.store_name}>
                  <Span>{product.store_name}</Span>
               </FlexChild>

               <FlexChild className={style.product_title}>
                  <P 
                     textOverflow={"ellipsis"}
                     display={"webkit-box"}
                     overflow={"hidden"}
                     lineClamp={lineClamp}
                  >
                     {product.title}
                  </P>
               </FlexChild>
               
               <HorizontalFlex className={style.content_item}>
                  {/* <Span
                     color="var(--main-color)"
                     weight={600}
                     fontSize={14}
                     hidden={product.discount_rate >= 1}
                     paddingRight={"0.5em"}
                  >
                     {product.discount_rate}
                  </Span> */}
                  <VerticalFlex className={style.price_box}>
                     <Span
                        className={style.through_price}
                        textDecoration={"line-through"}
                     >
                        {product.price}
                     </Span>
                     <Span className={style.discount_price} >
                        {product.discount_price} ₩
                     </Span>
                  </VerticalFlex>

                  <FlexChild onClick={toggleHeart} className={style.heart_counter}>
                     <Image
                        src={`/resources/icons/main/product_heart_icon${heartCheck === true ? '_active' : ''}.png`}
                        width={23}
                     />
                     <Span>{heartCount}</Span>
                  </FlexChild>
                  {/* <Span fontSize={14} weight={600}>
                     {currency_unit}
                  </Span> */}
               </HorizontalFlex>
            </VerticalFlex>
         </FlexChild>
      </VerticalFlex>
   )
}
