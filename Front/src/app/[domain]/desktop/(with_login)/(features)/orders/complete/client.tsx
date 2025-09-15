"use client";
import ProductCard from "@/components/card/ProductCard";
import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import NoContent from "@/components/noContent/noContent";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import clsx from "clsx";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import styles from "./page.module.css";

export function CompleteForm() {
  return (
    <VerticalFlex marginTop={80}>
      <VerticalFlex gap={30} width={"100%"} maxWidth={"1000px"}>
        <VerticalFlex className={styles.complete_title} gap={35}>
          <FlexChild justifyContent="center">
            <P size={30} weight={700} color="#fff">
              주문이 완료되었습니다.
            </P>
          </FlexChild>

          <FlexChild justifyContent="center">
            <P size={20} color="#aaa" weight={500} lineHeight={"1.4"}>
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
            <MyOrdersTable />
          </FlexChild>
        </VerticalFlex>

        <VerticalFlex className={clsx(styles.total_frame)} gap={25}>
          <FlexChild justifyContent="center">
            <P size={18} color="#fff" weight={500}>
              주문금액 {"40,000"}원 - 할인금액 {"0"}원 + 배송비 {"0"}원
            </P>
          </FlexChild>

          <FlexChild gap={7} justifyContent="center">
            <P size={20} color="#fff" weight={500}>
              실제 결제 금액
            </P>
            <P size={26} color="var(--main-color1)" weight={600}>
              {"40,000"}원
            </P>
          </FlexChild>
        </VerticalFlex>
      </VerticalFlex>
    </VerticalFlex>
  );
}

// 주문 리스트
export function MyOrdersTable() {
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
      date: "2025년 9월 10일",
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
      date: "2025년 9월 7일",
    },
  ];

  return (
    <>
      {/* 테이블 안에 tbody 안에 map은 그 날짜에 시킨 주문내역 전부 불러오게 바꾸기 */}
      {cart.length > 0 ? (
        <VerticalFlex gap={10}>
          <table className={styles.list_table}>
            <colgroup>
              <col style={{ width: "60%" }} />
              <col style={{ width: "20%" }} />
              <col style={{ width: "20%" }} />
            </colgroup>

            <thead>
              <tr className={styles.table_header}>
                <th>상품정보</th>
                <th>할인 금액</th>
                <th>결제 금액</th>
              </tr>
            </thead>

            <tbody>
              {cart.map(
                (
                  item,
                  i // ✅ 중괄호로 감싸기
                ) => (
                  <tr key={i}>
                    <td>
                      <FlexChild className={styles.order_item}>
                        <Image src={item.thumbnail} width={150} />

                        <VerticalFlex className={styles.order_txt}>
                          <span className={styles.brand}>{item.brand}</span>
                          <P className={styles.title}>{item.title}</P>

                          <VerticalFlex className={styles.option_list}>
                            {item.option.map((option, j) => (
                              <FlexChild key={j} gap={5}>
                                <P>{option.title}</P>
                                <Span> + {option.price}원</Span>
                              </FlexChild>
                            ))}
                          </VerticalFlex>
                        </VerticalFlex>
                      </FlexChild>
                    </td>

                    <td>
                      <P weight={600} color="#fff">
                        0원
                      </P>
                    </td>

                    <td>
                      <P weight={600}>{item.price} ₩</P>
                    </td>
                  </tr>
                )
              )}{" "}
              {/* ✅ map 닫는 괄호 위치 */}
            </tbody>
          </table>
        </VerticalFlex>
      ) : (
        <NoContent type="장바구니" />
      )}
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
