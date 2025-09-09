"use client";
import Button from "@/components/buttons/Button";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import Div from '@/components/div/Div'
import Input from "@/components/inputs/Input";
import ListPagination from "@/components/listPagination/ListPagination";
import NoContent from "@/components/noContent/noContent";
import P from "@/components/P/P";
import Select from "@/components/select/Select";
import Span from "@/components/span/Span";
import Link from "next/link";
import MasonryGrid from "@/components/masonry/MasonryGrid";
import boardStyle from "../boardGrobal.module.css";
import styles from "./page.module.css";
import clsx from "clsx";

export function ReviewList({ listCount }: { listCount?: number }) {

  // 리뷰 개수 조절
  const limit = listCount;

  const reviewTest = [
    // 리뷰 게시글 테스트용
    {
      name: "test",
      rating: 5,
      date: "2025-08-07",
      content: "옷 예쁘네요. 우리 존재 화이팅",
      photos: [],
      feedBack: {
        design: "마음에 쏙 들어요",
        Sturdiness: "부실해요",
        Upkeep: "쉽게 관리 가능해요",
      },
      product: {
         thumb: '/resources/images/dummy_img/review_img_01.png',
         title: '적나라 생츄어리',
         rating: '4.8',
         reviewcount: '4,567',
      }
    },
    {
      name: "test",
      rating: 3,
      date: "2025-08-07",
      content: `
            구조가 매우 복잡한 만큼 뒷처리도 힘듬
            단단해서 잘 안늘어나려고 하고 벌릴순 있지만 타이트해서 스텐봉 샤워기헤드 대신 쓸만한거
            하나사서 꼽은다음 물 트는게 가장 효과적으로 세척할 수 있을거같다
         `,
      photos: [],
      feedBack: {
        design: "마음에 쏙 들어요",
        Sturdiness: "양품이에요",
        Upkeep: "보통이에요",
      },
      product: {
         thumb: '/resources/images/dummy_img/review_img_01.png',
         title: '적나라 생츄어리',
         rating: '4.8',
         reviewcount: '4,567',
      }
    },
    {
      name: "test",
      rating: 4,
      date: "2025-08-07",
      content: "옷 예쁘네요. 우리 존재 화이팅",
      photos: [
        "/resources/images/dummy_img/review_img_01.png",
        "/resources/images/dummy_img/product_04.jpg",
        "/resources/images/dummy_img/review_img_02.jpg",
      ],
      feedBack: {
        design: "마음에 쏙 들어요",
        Sturdiness: "양품이에요",
        Upkeep: "관리하기 어려울 것 같아요",
      },
      product: {
         thumb: '/resources/images/dummy_img/review_img_01.png',
         title: '적나라 생츄어리',
         rating: '4.8',
         reviewcount: '4,567',
      }
    },
    {
      name: "test",
      rating: 2,
      date: "2025-08-07",
      content:
        "배송 빠릅니다. 유명하다 해서 주문해봤습니다. 감사합니다. 다음에 또 이용하겠습니다. 최신제조 상품같습니다.",
      photos: ["/resources/images/dummy_img/review_img_01.png"],
      feedBack: {
        design: "마음에 쏙 들어요",
        Sturdiness: "보통이에요",
        Upkeep: "보통이에요",
      },
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
        <VerticalFlex className={styles.review_list} gap={35}>
          {reviewTest.slice(0, limit).map((review, i) => (
            <HorizontalFlex key={i} gap={35} className={styles.item}>
              <VerticalFlex className={styles.item_header}>

                {/* 상품정보 */}
                <HorizontalFlex className={styles.prodcut_data}>
                  <FlexChild className={styles.img}>
                    <Image src={review.product.thumb} width={45} />
                  </FlexChild>

                  <VerticalFlex className={styles.info}>
                    <FlexChild className={styles.title}>
                        <P 
                          lineClamp={1}
                          overflow="hidden"
                          display="--webkit-box"
                        >
                          {review.product.title}
                        </P>
                    </FlexChild>
                    <FlexChild className={styles.info_rating}>
                        <P>평가 <Span>{review.product.rating}</Span></P>
                        <P
                          lineClamp={1}
                          overflow="hidden"
                          display="--webkit-box"
                        >
                          리뷰 <Span>{review.product.reviewcount}</Span>
                        </P>
                    </FlexChild>
                  </VerticalFlex>
                </HorizontalFlex>

                <VerticalFlex gap={10}>
                  <FlexChild gap={15}>
                    <Image
                      src={`/resources/icons/board/review_start_${review.rating}.png`}
                      width={100}
                    />
                  </FlexChild>
  
                  <FlexChild>
                    <P color="#797979" size={13}>
                      {review.date}
                    </P>
                  </FlexChild>
                </VerticalFlex>

              </VerticalFlex>

              <VerticalFlex gap={25}>
                <HorizontalFlex className={styles.feedback}>
                  <FlexChild className={styles.feed_item}>
                    <FlexChild className={styles.feed_title}>
                      <P>외형/디자인</P>
                    </FlexChild>
  
                    <FlexChild className={styles.feed_content}>
                      <P>{review.feedBack.design}</P>
                    </FlexChild>
                  </FlexChild>
  
                  <FlexChild className={styles.feed_item}>
                    <FlexChild className={styles.feed_title}>
                      <P>마감/내구성</P>
                    </FlexChild>
  
                    <FlexChild className={styles.feed_content}>
                      <P>{review.feedBack.Sturdiness}</P>
                    </FlexChild>
                  </FlexChild>
  
                  <FlexChild className={styles.feed_item}>
                    <FlexChild className={styles.feed_title}>
                      <P>유지관리</P>
                    </FlexChild>
  
                    <FlexChild className={styles.feed_content}>
                      <P>{review.feedBack.Upkeep}</P>
                    </FlexChild>
                  </FlexChild>
                </HorizontalFlex>
  
                <HorizontalFlex className={styles.content}>
                  {review.photos.length > 0 && (
                    <FlexChild
                      width={180}
                      className={styles.img_box}
                      cursor="pointer"
                    >
                      <Image
                        src={review.photos[0]}
                        width={"100%"}
                        height={"auto"}
                      />
                      <Div className={styles.img_length}>
                        {review.photos.length}
                      </Div>
                    </FlexChild>
                  )}
  
                  {/* 이미지 클릭하면 모달로 이미지 슬라이더 나타나서 크게 보여주기 */}
                  {/* {
                                review.photos?.length > 0 && (
                                   review.photos?.map((img, j)=> (
                                      <FlexChild key={j} >
                                         <Image src={img} width={'100%'} height={'auto'} />
                                      </FlexChild>
                                   ))
                                )
                             } */}
                  <P size={14} color="#fff" lineHeight={1.6}>
                    {review.content}
                  </P>
                </HorizontalFlex>
              </VerticalFlex>
            </HorizontalFlex>
          ))}
        </VerticalFlex>
      ) : (
        <NoContent type="리뷰" />
      )}
    </>
  );
}
