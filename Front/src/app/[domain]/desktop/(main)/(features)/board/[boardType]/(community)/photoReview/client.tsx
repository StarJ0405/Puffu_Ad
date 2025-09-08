"use client";
import Button from "@/components/buttons/Button";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import ListPagination from "@/components/listPagination/ListPagination";
import NoContent from "@/components/noContent/noContent";
import Select from "@/components/select/Select";
import ReviewImgCard from "@/components/card/reviewImgCard";
import Input from "@/components/inputs/Input";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import clsx from "clsx";
import Link from "next/link";
import boardStyle from "../../boardGrobal.module.css"
import styles from "./photoReview.module.css";
import MasonryGrid from "@/components/masonry/MasonryGrid";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, Navigation } from 'swiper/modules';
import {Swiper as SwiperType} from 'swiper';

// 게시판 리스트 -----------------------------------------------
export function BoardTitleBox() {
   return (
      <HorizontalFlex className={boardStyle.board_titleBox}>
         <FlexChild>
            {/* 여기 현재 path 주소에 맞게 이름 바뀌게 해야 함. */}
            <h3>포토 사용후기</h3>
         </FlexChild>

         <FlexChild gap={10} className={boardStyle.search_box}>
            <FlexChild width={'auto'}>
               <Select
                  classNames={{
                     header: boardStyle.search_select_body,
                  }}
                  options={[
                     { value: "제목", display: "제목" },
                     { value: "내용", display: "내용" },
                     { value: "작성자", display: "작성자" },
                  ]}
                  // placeholder={'선택 안함'}
                  // value={selectedMessageOption}
               />
            </FlexChild>

            <Input type={'search'} placeHolder={'검색 내용을 입력해 주세요.'}></Input>
            <Link href={'/board/notice/noticeWrite'}>
               <Button className={boardStyle.searchBtn}>검색</Button>
            </Link>
         </FlexChild>
      </HorizontalFlex>
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


export function BestReviewSlider({id, lineClamp }: { id: string, lineClamp?: number }) {
   
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
               slidesPerView={7}
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
                           width={142}
                           board="photoReviewSlide"
                           // lineClamp={lineClamp ?? 2}
                        />
                     </SwiperSlide>
                  )
                  })
               }
            </Swiper>
            {
               // 슬라이드옵션들 props로 빼버리고 그 값 따라서 조건문 걸기
            }
            <div className={clsx(styles.naviBtn, styles.prevBtn)}>
              <Image src={'/resources/icons/arrow/slide_arrow.png'} width={10}></Image>
            </div>
            <div className={clsx(styles.naviBtn, styles.nextBtn)}>
              <Image src={'/resources/icons/arrow/slide_arrow.png'} width={10}></Image>
            </div>
         </FlexChild>
         ): (
            <NoContent />
         )}
      </>
   )
}



export function GalleryTable() {
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
         content: '벌써 2번째 구매네요. 항상 잘 씀.',
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
    <VerticalFlex>
      <FlexChild>
        {reviewTest.length > 0 ? (
         <MasonryGrid gap={20} breakpoints={5}>
            {
               reviewTest.map((item, i) => {
                  return (
                     <ReviewImgCard key={i} review={item} />
                  )
               })
            }
         </MasonryGrid>
        ) : (
          <NoContent />
        )}
      </FlexChild>

      <FlexChild justifyContent="center" marginTop={30}>
         {
            /* 누르면 리뷰 데이터 더 불러와서 아래로 보여주기 
            데이터가 만약 10개보다 적거나 데이터를 전부 보여줬다면 더보기 버튼 눌렀을때
            사라지기.
         */}
         <Button className={styles.more_btn}>더보기</Button>
      </FlexChild>
    </VerticalFlex>
  );
}

// 게시판 리스트 end -----------------------------------------------
