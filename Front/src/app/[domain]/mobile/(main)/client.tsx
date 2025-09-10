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
import ReviewImgCard from "@/components/card/reviewImgCard";
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
import Link from "next/link";
import styles from "./page.module.css";


import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, Navigation } from 'swiper/modules';
import {Swiper as SwiperType} from 'swiper';
import NoContent from "@/components/noContent/noContent";




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


export function MainBanner() {
   const swiperRef = useRef<SwiperType | null>(null);

   const components = [ // 임시
      {img: '/resources/images/dummy_img/main_banner_01.png', link: '/'},
      {img: '/resources/images/dummy_img/main_banner_02.png', link: '/'},
      {img: '/resources/images/dummy_img/main_banner_03.png', link: '/'},
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
      <FlexChild className={clsx('page_container', styles.main_banner)}>
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
                     <Link href={item.link}>
                        <div className={styles.slideItem} style={{backgroundImage: `url(${item.img})`}}></div>
                     </Link>
                  </SwiperSlide>
               )
               })
            }
         </Swiper>
      </FlexChild>
   )
}


export function LinkBanner() {

   const link_banner = [
    {link: '/', src: '/resources/images/dummy_img/link_banner_01.png'},
    {link: '/', src: '/resources/images/dummy_img/link_banner_02.png'},
    {link: '/', src: '/resources/images/dummy_img/link_banner_03.png'},
    {link: '/', src: '/resources/images/dummy_img/link_banner_04.png'}
  ]

   return (
      <FlexChild width={'auto'}>
         <div className={styles.link_Banner}>
         {
            link_banner.map((item, i) => (
               <Link href={item.link} key={i}>
               <Image 
                  src={item.src}
                  width={'100%'}
                  height={'auto'}
               />
               </Link>
            ))
         }
         </div>
      </FlexChild>
   )
}

export function MiniBanner() {

   const link_banner = [
    {link: '/', src: '/resources/images/dummy_img/mini_banner_01.png'},
    {link: '/', src: '/resources/images/dummy_img/mini_banner_02.png'},
    {link: '/', src: '/resources/images/dummy_img/mini_banner_03.png'},
    {link: '/', src: '/resources/images/dummy_img/mini_banner_04.png'}
  ]

   return (
      <FlexChild width={'auto'}>
         <div className={styles.mini_Banner}>
         {
            link_banner.map((item, i) => (
               <Link href={item.link} key={i} className={clsx((item.link?.length <=1 ? styles.disabled : ''))}>
               <Image 
                  src={item.src}
                  width={'100%'}
                  height={'auto'}
               />
               </Link>
            ))
         }
         </div>
      </FlexChild>
   )
}



export function MainCategory() { // 카테고리메뉴

   const pathname = usePathname();

   const ca_test = [
      {name: '남성토이', thumbnail: '/resources/images/category/gif_ca_Img_01.gif',},
      {name: '여성토이', thumbnail: '/resources/images/category/gif_ca_Img_02.gif',},
      {name: '윤활제/젤', thumbnail: '/resources/images/category/gif_ca_Img_03.gif',},
      {name: '콘돔', thumbnail: '/resources/images/category/gif_ca_Img_04.gif',},
      {name: '의류', thumbnail: '/resources/images/category/gif_ca_Img_05.gif',},
      {name: 'BDSM 토이', thumbnail: '/resources/images/category/gif_ca_Img_06.gif',},
      {name: 'LGBT 토이', thumbnail: '/resources/images/category/gif_ca_Img_07.gif',},
      {name: '악세서리', thumbnail: '/resources/images/category/ca_img08.png',},
   ]

   return (
      <nav className={styles.category_wrap}>
         {
            ca_test.map((cat, i)=> (
               <VerticalFlex className={styles.ca_item} key={i}>
                  <FlexChild className={styles.ca_thumb}>
                     <Image 
                        src={cat.thumbnail}
                        width={'auto'}
                        height={120}
                     />
                  </FlexChild>
                  <Span>{cat.name}</Span>
               </VerticalFlex>
            ))
         }
      </nav>
   )
}


type ReviewItem = {
  thumbnail: string;
  content: string;
  name: string;
  date: string;
  product: {
    thumb: string;
    title: string;
    rating: string;
    reviewcount: string;
  };
};


export function ProductSlider({id, lineClamp }: { id: string, lineClamp?: number }) {
   
   const reviewTest: ReviewItem[] = [
      {
         thumbnail: '/resources/images/dummy_img/review_img_01.png',
         content: '벌써 2번째 구매네요. 항상 잘 쓰고 있습니다.',
         name: '김한별',
         date: '2025-08-01',
         product: {
            thumb: '/resources/images/dummy_img/review_img_01.png',
            title: '적나라 생츄어리',
            rating: '4.8',
            reviewcount: '4,567',
         }
      },
      {
         thumbnail: '/resources/images/dummy_img/review_img_01.png',
         content: '벌써 2번째 구매네요. 항상 잘 쓰고 있습니다.',
         name: '김한별',
         date: '2025-08-01',
         product: {
            thumb: '/resources/images/dummy_img/review_img_01.png',
            title: '적나라 생츄어리',
            rating: '4.8',
            reviewcount: '4,567',
         }
      },
      {
         thumbnail: '/resources/images/dummy_img/review_img_01.png',
         content: '벌써 2번째 구매네요. 항상 잘 쓰고 있습니다.',
         name: '김한별',
         date: '2025-08-01',
         product: {
            thumb: '/resources/images/dummy_img/review_img_01.png',
            title: '적나라 생츄어리',
            rating: '4.8',
            reviewcount: '4,567',
         }
      },
      {
         thumbnail: '/resources/images/dummy_img/review_img_01.png',
         content: '벌써 2번째 구매네요. 항상 잘 쓰고 있습니다.',
         name: '김한별',
         date: '2025-08-01',
         product: {
            thumb: '/resources/images/dummy_img/review_img_01.png',
            title: '적나라 생츄어리',
            rating: '4.8',
            reviewcount: '4,567',
         }
      },
      {
         thumbnail: '/resources/images/dummy_img/review_img_01.png',
         content: '벌써 2번째 구매네요. 항상 잘 쓰고 있습니다.',
         name: '김한별',
         date: '2025-08-01',
         product: {
            thumb: '/resources/images/dummy_img/review_img_01.png',
            title: '적나라 생츄어리',
            rating: '4.8',
            reviewcount: '4,567',
         }
      },
      {
         thumbnail: '/resources/images/dummy_img/review_img_01.png',
         content: '벌써 2번째 구매네요. 항상 잘 쓰고 있습니다.',
         name: '김한별',
         date: '2025-08-01',
         product: {
            thumb: '/resources/images/dummy_img/review_img_01.png',
            title: '적나라 생츄어리',
            rating: '4.8',
            reviewcount: '4,567',
         }
      },
   ];

   return (
      <>
         {reviewTest.length > 0 ? (
         <FlexChild id={id} className={styles.ProductSlider}>
            <Swiper
               loop={true}
               slidesPerView={5}
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
                  reviewTest.map((review, i) => {
                  return (
                     <SwiperSlide key={i}>
                        <ReviewImgCard
                           review={review}
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




export function ProductList({id, lineClamp }: { id: string, lineClamp?: number }) {

   return (
      <>
         {ListProduct.length > 0 ? (
         <VerticalFlex gap={10}>
            <MasonryGrid gap={20} breakpoints={6}>
               {
                  ListProduct.map((product, i) => {
                     return (
                        <TestProductCard
                           product={product}
                           lineClamp={2}
                           key={i}
                           width={200}
                        />
                     )
                  })
               }
            </MasonryGrid>
            {/* <ProductCard 
                              product={{
                                 id: "123",
                                 title: "테스트 상품",
                                 thumbnail: "/test.png",
                                 price: 10000,
                                 discount_price: 8000,
                                 discount_rate: 0.8,
                                 store: "테스트 스토어",
                                 brand: "브랜드명",
                                 category: "카테고리",
                                 variants: [],
                              }}
                              currency_unit="₩"
                           /> */}
            <Button className={styles.list_more_btn}>
               <FlexChild gap={10}>
                  <Span>상품 더보기</Span>
                  <Image src={'/resources/icons/arrow/arrow_bottom_icon.png'} width={10} />
               </FlexChild>
            </Button>
         </VerticalFlex>
         ): (
            <NoContent type="상품" />
         )}
      </>
   )
}



