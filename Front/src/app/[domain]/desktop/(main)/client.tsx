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
import TestProductCard from "@/components/card/TestProductCard";
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
import { usePathname } from "next/navigation";
import style from "./page.module.css";


import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, Navigation } from 'swiper/modules';
import {Swiper as SwiperType} from 'swiper';




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
]


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
              clickable: true,
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


export function MainCategory() { // 카테고리메뉴

   const pathname = usePathname();
   

   const ca_test = [
      {name: '코스튬/속옷', thumbnail: '/resources/images/category/ca_costum.png', width: 40,},
      {name: '진동기', thumbnail: '/resources/images/category/ca_suction.png', width: 54,},
      {name: '흡입기', thumbnail: '/resources/images/category/ca_vibrator.png', width: 54,},
   ]

   return (
      <nav className={style.category_wrap}>
         {
            pathname !== "/" ?
            <VerticalFlex className={clsx(style.ca_item, style.ca_all)}>
               <Span>ALL</Span>
            </VerticalFlex>
            : null
         }
         {
            ca_test.map((cat, i)=> (
               <VerticalFlex className={style.ca_item} key={i}>
                  <Image 
                     src={cat.thumbnail}
                     width={cat.width}
                  />
                  <Span>{cat.name}</Span>
               </VerticalFlex>
            ))
         }
      </nav>
   )
}





export function ProductSlider({id, lineClamp }: { id: string, lineClamp?: number }) {

   return (
      <FlexChild id={id} className={style.ProductSlider}>
         <Swiper
            loop={true}
            slidesPerView={6}
            speed={600}
            spaceBetween={20}
            modules={[Autoplay, Navigation]}
            autoplay={{ delay: 4000 }}
            navigation={{
               prevEl: `#${id} .${style.prevBtn}`,
               nextEl: `#${id} .${style.nextBtn}`,
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

         <div className={clsx(style.naviBtn, style.prevBtn)}>
           <Image src={'/resources/icons/arrow/slide_arrow.png'} width={10}></Image>
         </div>
         <div className={clsx(style.naviBtn, style.nextBtn)}>
           <Image src={'/resources/icons/arrow/slide_arrow.png'} width={10}></Image>
         </div>
      </FlexChild>
   )
}




export function ProductList() {

   return (
      <MasonryGrid gap={20} breakpoints={5}>
         {
            ListProduct.map((product, i) => {
               return (
                  <TestProductCard
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



