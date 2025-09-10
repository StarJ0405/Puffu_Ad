"use client";
import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import NoContent from "@/components/noContent/noContent";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import styles from "./page.module.css";


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
        <VerticalFlex gap={30}>
          {cart.map((item, i) => (
            <VerticalFlex key={i} gap={10}>
              <FlexChild>
                {item.date}
              </FlexChild>

              <table className={styles.list_table}>
                {/* 게시판 셀 너비 조정 */}
                <colgroup>
                  <col style={{ width: "60%" }} />
                  <col style={{ width: "20%" }} />
                  <col style={{ width: "20%" }} />
                </colgroup>

                {/* 헤더 */}
                <thead>
                  <tr className={styles.table_header}>
                    <th>상품정보</th>
                    <th>할인 금액</th>
                    <th>결제 금액</th>
                  </tr>
                </thead>

                {/* 상품 내용 */}
                <tbody>
                  <tr>

                    <td>
                      <FlexChild className={styles.order_item}>
                        <Image src={item.thumbnail} width={150} />

                        <VerticalFlex className={styles.order_txt}>
                          <span className={styles.brand}>
                            {item.brand}
                          </span>

                          <P className={styles.title}>
                            {item.title}
                          </P>

                          <VerticalFlex className={styles.option_list}>
                            {
                              item.option.map((option, j)=> (
                                <FlexChild key={j} gap={5}>
                                  <P>{option.title}</P>
                                  <Span> + {option.price}원</Span>
                                </FlexChild>
                              ))
                            }
                          </VerticalFlex>
                        </VerticalFlex>
                      </FlexChild>
                    </td>


                    <td>
                      <P weight={600} color="#fff">0원</P>
                    </td>

                    <td>
                      <P weight={600}>{item.price} ₩</P>
                    </td>
                  </tr>
                </tbody>
              </table>
            </VerticalFlex>
          ))}
        </VerticalFlex>
      ) : (
        <NoContent type="장바구니" />
      )}
    </>
  );
}
