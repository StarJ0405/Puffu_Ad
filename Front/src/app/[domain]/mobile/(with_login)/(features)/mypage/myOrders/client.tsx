"use client";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import NoContent from "@/components/noContent/noContent";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import styles from "./page.module.css";

export function MyOrdersTable() {
  const cart = [
    {
      content: [
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
      ],
      date: "2025년 9월 10일",
    },
    {
      content: [
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
      ],
      date: "2025년 9월 7일",
    },
  ];
  return (
    <>
      <VerticalFlex gap={20}>
        {cart.length > 0 ? (
          cart.map((item, i) => (
            <VerticalFlex key={i} gap={20}>
              <VerticalFlex gap={10} borderBottom={"1px solid #bbb"}>
                <FlexChild>
                  <P size={15} weight={500}>
                    {item.date}
                  </P>
                </FlexChild>

                {item.content.map((child, j) => (
                  <VerticalFlex
                    key={j}
                    className={styles.list_item}
                    gap={30}
                    borderBottom={"1px solid #323232"}
                  >
                    {/* 상품 단위 */}
                    <HorizontalFlex className={styles.unit}>
                      <Image
                        src={child.thumbnail}
                        width={80}
                        borderRadius={5}
                      />
                      <VerticalFlex
                        className={styles.unit_content}
                        width={"auto"}
                        alignItems="start"
                      >
                        <FlexChild gap={5}>
                          <Span className={styles.unit_brand}>
                            {child.brand}
                          </Span>
                          <Image src={child.delivery} width={13} />
                        </FlexChild>

                        <P
                          className={styles.unit_title}
                          lineClamp={2}
                          overflow="hidden"
                          display="--webkit-box"
                        >
                          {child.title}
                        </P>
                      </VerticalFlex>
                    </HorizontalFlex>

                    {/* 옵션 리스트 */}
                    <VerticalFlex className={styles.option_list}>
                      {child.option.map((option, k) => (
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
                        <Span
                          color="var(--main-color1)"
                          weight={600}
                          fontSize={20}
                        >
                          {child.price}₩
                        </Span>
                      </FlexChild>
                    </HorizontalFlex>
                  </VerticalFlex>
                ))}
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
