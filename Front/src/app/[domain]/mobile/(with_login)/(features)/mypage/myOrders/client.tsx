"use client";
import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import NoContent from "@/components/noContent/noContent";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import styles from "./page.module.css";
import HorizontalFlex from "@/components/flex/HorizontalFlex";


export function MyOrdersTable() {
  const cart = [
    {
        title: '여성용) 핑크색 일본 st 로제 베일 가운',
        thumbnail: '/resources/images/dummy_img/product_07.png',
        brand: '푸푸토이',
        price: '20,000',
        option: [
          {title: '여성용) 핑크색 일본 컬러 레드', price: '0'},
          {title: '여성용) 핑크색 일본 1+1 증정', price: '1,000'},
        ],
        delivery: '/resources/icons/cart/cj_icon.png',
        date: '2025년 9월 10일',
    },
    {
        title: '여성용) 핑크색 일본 st 로제 베일 가운',
        thumbnail: '/resources/images/dummy_img/product_07.png',
        brand: '푸푸토이',
        price: '20,000',
        option: [
          {title: '여성용) 핑크색 일본 컬러 레드', price: '0'},
          {title: '여성용) 핑크색 일본 1+1 증정', price: '1,000'},
        ],
        delivery: '/resources/icons/cart/cj_icon.png',
        date: '2025년 9월 7일',
    }
  ]

  return (
    <>
      {/* 테이블 안에 tbody 안에 map은 그 날짜에 시킨 주문내역 전부 불러오게 바꾸기 */}
      {cart.length > 0 ? (
        <VerticalFlex gap={20}>
          {cart.map((item, i) => (
            <VerticalFlex key={i} gap={10} borderBottom={'1px solid #323232'}>
              <FlexChild>
                <P size={15} weight={500}>{item.date}</P>
              </FlexChild>

              <VerticalFlex className={styles.list_item} gap={30}>

                <HorizontalFlex className={styles.unit} >
                  <Image
                    src={item.thumbnail}
                    width={80} borderRadius={5}
                  />
                  <VerticalFlex
                    className={styles.unit_content}
                    width={"auto"}
                    alignItems="start"
                  >
                    <FlexChild gap={5}>
                      <Span className={styles.unit_brand}>
                        {item.brand}
                      </Span>

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
                    <VerticalFlex className={styles.option_list}>
                      {
                        item.option.map((option, j)=> (
                          <HorizontalFlex key={j} gap={10}>
                            <P>{option.title}</P>
                            <Span> + {option.price}원</Span>
                          </HorizontalFlex>
                        ))
                      }
                    </VerticalFlex>
                  </VerticalFlex>
                </HorizontalFlex>

                <HorizontalFlex className={styles.price_box}>
                  <FlexChild>
                    <P>할인금액 : </P>
                    <Span>0원</Span>
                  </FlexChild>

                  <FlexChild>
                    <P>결제 금액 : </P>
                    <Span color="var(--main-color1)" weight={600} fontSize={20}>{item.price}₩</Span>
                  </FlexChild>
                </HorizontalFlex>
              </VerticalFlex>
            </VerticalFlex>
          ))}
        </VerticalFlex>
      ) : (
        <NoContent type="장바구니" />
      )}
    </>
  );
}
