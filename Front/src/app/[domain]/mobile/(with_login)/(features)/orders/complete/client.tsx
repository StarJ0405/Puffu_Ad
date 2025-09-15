"use client";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Input from "@/components/inputs/Input";
import P from "@/components/P/P";
import Select from "@/components/select/Select";
import Span from "@/components/span/Span";
import { useState } from "react";
import styles from "./page.module.css";
import Image from "@/components/Image/Image";
import NoContent from "@/components/noContent/noContent";
import clsx from "clsx";
import Link from "next/link";
import Button from "@/components/buttons/Button";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import ProductCard from "@/components/card/ProductCard";

export function CompleteForm() {
  return (
    <VerticalFlex>
      <VerticalFlex gap={30} width={"100%"} maxWidth={"1000px"}>
        <VerticalFlex className={styles.complete_title} gap={35}>
          <FlexChild justifyContent="center">
            <P size={25} weight={700} color="#fff">
              주문이 완료되었습니다.
            </P>
          </FlexChild>

          <FlexChild justifyContent="center">
            <P size={16} color="#aaa" weight={500} lineHeight={"1.4"}>
              <Span color="#fff">{"2025.09.01"}</Span> 주문하신 <br />
              상품의 주문번호는{" "}
              <Span color="var(--main-color1)">{"12345667"}</Span> 입니다.
            </P>
          </FlexChild>
        </VerticalFlex>

        <VerticalFlex className={clsx(styles.box_frame)} marginTop={50}>
          <FlexChild className={styles.box_header}>
            <P>배송지 정보</P>
          </FlexChild>

          <VerticalFlex
            gap={15}
            className={styles.delivery_info}
            marginTop={20}
          >
            <FlexChild justifyContent="center">
              <P className={styles.delivery_txt}>김철수</P>
            </FlexChild>

            <FlexChild justifyContent="center">
              <P className={styles.delivery_txt}>
                (35353) 서구 도안동로 234 대전 303동 1302호
              </P>
            </FlexChild>

            <FlexChild justifyContent="center">
              <P className={styles.delivery_txt}>01012345678</P>
            </FlexChild>

            <FlexChild justifyContent="center">
              <P className={styles.delivery_txt}>
                배송요청사항 : 현관문 앞에 놔주세요.
              </P>
            </FlexChild>
          </VerticalFlex>
        </VerticalFlex>

        <VerticalFlex className={clsx(styles.box_frame)}>
          <FlexChild className={styles.box_header}>
            <P>주문 상품</P>
          </FlexChild>

          <FlexChild marginTop={15}>
            <CompleteOrdersTable />
          </FlexChild>
        </VerticalFlex>

        <VerticalFlex className={clsx(styles.total_frame)} gap={60}>
          <VerticalFlex justifyContent="center" gap={15}>
            <FlexChild justifyContent="center">
              <P size={16} color="#fff" weight={500}>
                주문금액 {"40,000"}원
              </P>
            </FlexChild>

            <FlexChild justifyContent="center">
              <P size={16} color="#fff" weight={500}>
                할인금액 {"0"}원
              </P>
            </FlexChild>

            <FlexChild justifyContent="center">
              <P size={16} color="#fff" weight={500}>
                + 배송비 {"0"}원
              </P>
            </FlexChild>
          </VerticalFlex>

          <VerticalFlex gap={10} justifyContent="center">
            <FlexChild justifyContent="center">
              <P size={16} color="#fff" weight={500}>
                실제 결제 금액
              </P>
            </FlexChild>

            <FlexChild justifyContent="center">
              <P size={25} color="var(--main-color1)" weight={600}>
                {"40,000"}원
              </P>
            </FlexChild>
          </VerticalFlex>
        </VerticalFlex>
      </VerticalFlex>
    </VerticalFlex>
  );
}

// 주문 리스트
export function CompleteOrdersTable() {
  const cart = [
    {
      title: "여성용) 핑크색 일본 st 로제 베일 가운",
      thumbnail: "/resources/images/dummy_img/product_07.png",
      brand: "푸푸토이",
      price: "20,000",
      option: [
        { title: "여성용) 핑크색 일본 컬러 레드", price: "0" },
        { title: "여성용) 핑크색 일본 1+1 증정", price: "1,000" },
      ],
      delivery: "/resources/icons/cart/cj_icon.png",
    },
    {
      title: "여성용) 핑크색 일본 st 로제 베일 가운",
      thumbnail: "/resources/images/dummy_img/product_07.png",
      brand: "푸푸토이",
      price: "20,000",
      option: [
        { title: "여성용) 핑크색 일본 컬러 레드", price: "0" },
        { title: "여성용) 핑크색 일본 1+1 증정", price: "1,000" },
      ],
      delivery: "/resources/icons/cart/cj_icon.png",
    },
  ];
  return (
    <>
      <VerticalFlex gap={20}>
        {cart.length > 0 ? (
          cart.map((item, i) => (
            <VerticalFlex key={i} gap={20}>
              <VerticalFlex
                className={styles.list_item}
                gap={30}
                borderBottom={"1px solid #323232"}
              >
                {/* 상품 단위 */}
                <HorizontalFlex className={styles.unit}>
                  <Image src={item.thumbnail} width={80} borderRadius={5} />
                  <VerticalFlex
                    className={styles.unit_content}
                    width={"auto"}
                    alignItems="start"
                  >
                    <FlexChild gap={5}>
                      <Span className={styles.unit_brand}>{item.brand}</Span>
                      <Image src={item.delivery} width={13} />
                    </FlexChild>

                    <P
                      className={styles.unit_title}
                      lineClamp={2}
                      overflow="hidden"
                      display="--webkit-box"
                    >
                      {item.title}
                    </P>
                  </VerticalFlex>
                </HorizontalFlex>

                {/* 옵션 리스트 */}
                <VerticalFlex className={styles.option_list}>
                  {item.option.map((option, k) => (
                    <HorizontalFlex key={k} gap={10}>
                      <P>{option.title}</P>
                      <Span> + {option.price}원</Span>
                    </HorizontalFlex>
                  ))}
                </VerticalFlex>

                {/* 가격 박스 */}
                <HorizontalFlex className={styles.price_box}>
                  <FlexChild>
                    <P>할인금액 : </P>
                    <Span>0원</Span>
                  </FlexChild>

                  <FlexChild>
                    <P>결제 금액 : </P>
                    <Span color="var(--main-color1)" weight={600} fontSize={20}>
                      {item.price}₩
                    </Span>
                  </FlexChild>
                </HorizontalFlex>
              </VerticalFlex>
            </VerticalFlex>
          ))
        ) : (
          <NoContent type="장바구니" />
        )}
      </VerticalFlex>
    </>
  );
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
  id: string;
};

export function ChoiseProductSlider({
  id,
  lineClamp,
}: {
  id: string;
  lineClamp?: number;
}) {

  const ListProduct: ProductData[] = [];

  return (
    <>
      {ListProduct.length > 0 ? (
        <FlexChild id={id} className={styles.ProductSlider}>
          <Swiper
            loop={true}
            slidesPerView={2.2}
            speed={600}
            spaceBetween={20}
            modules={[Autoplay, Navigation]}
            autoplay={{ delay: 4000 }}
            navigation={{
              prevEl: `#${id} .${styles.prevBtn}`,
              nextEl: `#${id} .${styles.nextBtn}`,
            }}
          >
            {ListProduct.map((product: ProductData, i: number) => {
              return (
                <SwiperSlide key={i}>
                  <ProductCard product={product} lineClamp={lineClamp ?? 2} />
                </SwiperSlide>
              );
            })}
          </Swiper>

          <div className={clsx(styles.naviBtn, styles.prevBtn)}>
            <Image
              src={"/resources/icons/arrow/slide_arrow.png"}
              width={10}
            ></Image>
          </div>
          <div className={clsx(styles.naviBtn, styles.nextBtn)}>
            <Image
              src={"/resources/icons/arrow/slide_arrow.png"}
              width={10}
            ></Image>
          </div>
        </FlexChild>
      ) : (
        <NoContent type="상품" />
      )}
    </>
  );
}
